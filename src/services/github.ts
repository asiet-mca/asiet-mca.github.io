const API = "https://api.github.com";

export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
  basePath: string;
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  download_url: string | null;
  html_url: string;
}

export class GitHubService {
  constructor(private config: GitHubConfig) {}

  private get headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.config.token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  private fullPath(relativePath: string): string {
    return relativePath
      ? `${this.config.basePath}/${relativePath}`
      : this.config.basePath;
  }

  private encodePath(path: string): string {
    return path
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");
  }

  private contentsUrl(relativePath: string): string {
    return `${API}/repos/${this.config.owner}/${this.config.repo}/contents/${this.encodePath(this.fullPath(relativePath))}`;
  }

  async verify(): Promise<{ ok: boolean; name?: string; error?: string }> {
    try {
      const r = await fetch(
        `${API}/repos/${this.config.owner}/${this.config.repo}`,
        { headers: this.headers }
      );
      if (r.status === 401)
        return { ok: false, error: "Invalid or expired token." };
      if (r.status === 404)
        return { ok: false, error: "Repository not found." };
      if (!r.ok) return { ok: false, error: r.statusText };
      const d = await r.json();
      return { ok: true, name: d.full_name };
    } catch {
      return { ok: false, error: "Network error." };
    }
  }

  async list(path = ""): Promise<GitHubContent[]> {
    const r = await fetch(
      `${this.contentsUrl(path)}?ref=${this.config.branch}`,
      { headers: this.headers }
    );
    if (r.status === 404) return [];
    if (!r.ok) throw new Error(r.statusText);
    const d = await r.json();
    return Array.isArray(d)
      ? (d as GitHubContent[])
          .filter((i) => i.name !== ".gitkeep")
          .sort((a, b) =>
            a.type !== b.type
              ? a.type === "dir"
                ? -1
                : 1
              : a.name.localeCompare(b.name)
          )
      : [];
  }

  async upload(path: string, base64: string, msg?: string): Promise<void> {
    const url = this.contentsUrl(path);
    let sha: string | undefined;
    try {
      const c = await fetch(`${url}?ref=${this.config.branch}`, {
        headers: this.headers,
      });
      if (c.ok) sha = (await c.json()).sha;
    } catch {}

    const name = path.split("/").pop()!;
    const body: Record<string, string> = {
      message: msg || `Add ${name}`,
      content: base64,
      branch: this.config.branch,
    };
    if (sha) body.sha = sha;

    const r = await fetch(url, {
      method: "PUT",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.message || r.statusText);
    }
  }

  async delete(path: string, sha: string, msg?: string): Promise<void> {
    const name = path.split("/").pop()!;
    const r = await fetch(this.contentsUrl(path), {
      method: "DELETE",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg || `Remove ${name}`,
        sha,
        branch: this.config.branch,
      }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.message || r.statusText);
    }
  }

  async mkdir(path: string, msg?: string): Promise<void> {
    const name = path.split("/").pop()!;
    await this.upload(`${path}/.gitkeep`, btoa(""), msg || `Create ${name}`);
  }

  async rmdir(path: string, msg?: string): Promise<void> {
    const r = await fetch(
      `${this.contentsUrl(path)}?ref=${this.config.branch}`,
      { headers: this.headers }
    );
    if (!r.ok) return;
    const items: GitHubContent[] = await r.json();
    if (!Array.isArray(items)) return;

    const name = path.split("/").pop()!;
    const m = msg || `Remove ${name}`;
    for (const item of items) {
      const rel = item.path.startsWith(this.config.basePath + "/")
        ? item.path.slice(this.config.basePath.length + 1)
        : item.path;
      try {
        if (item.type === "dir") await this.rmdir(rel, m);
        else await this.delete(rel, item.sha, m);
      } catch {
        // Continue deleting remaining items even if one fails
      }
    }
  }

  downloadUrl(item: GitHubContent): string {
    return (
      item.download_url ||
      `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/${item.path}`
    );
  }

  async ensureBasePath(): Promise<void> {
    const r = await fetch(
      `${this.contentsUrl("")}?ref=${this.config.branch}`,
      { headers: this.headers }
    );
    if (r.status === 404) {
      await this.upload(
        ".gitkeep",
        btoa(""),
        `Initialize ${this.config.basePath}`
      );
    }
  }
}
