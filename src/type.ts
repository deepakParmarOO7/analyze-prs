export type PullRequestReviewComment = {
  url: string
  pull_request_review_id: number
  id: number
  node_id: string
  diff_hunk: string
  path: string
  commit_id: string
  original_commit_id: string
  user: GitHubUser
  body: string
  created_at: string
  updated_at: string
  html_url: string
  pull_request_url: string
  author_association: string
  _links: {
    self: { href: string }
    html: { href: string }
    pull_request: { href: string }
  }
  reactions: {
    url: string
    total_count: number
    "+1": number
    "-1": number
    laugh: number
    hooray: number
    confused: number
    heart: number
    rocket: number
    eyes: number
  }
  start_line: number | null
  original_start_line: number | null
  start_side: string | null
  line: number
  original_line: number
  side: "RIGHT" | "LEFT"
  original_position: number
  position: number
  subject_type: string
}

export type GitHubUser = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  user_view_type: string
  site_admin: boolean
}
