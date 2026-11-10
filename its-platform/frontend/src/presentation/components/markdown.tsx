import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/shared/utils/cn';

/**
 * Renders authored lesson markdown.
 *
 * `Markdown` is used rather than `MarkdownHooks` on purpose: it is a *synchronous,
 * hook-free* component, so it stays a Server Component and the markdown never has to be
 * shipped to the browser as a payload plus a parser. (Only `MarkdownAsync` and
 * `MarkdownHooks` exist for async plugin chains, which this does not have.)
 *
 * Raw HTML is not enabled — no `rehype-raw` — so a `<script>` in an authored body is text,
 * not a script. The catalogue is ours, but the lesson bodies are markdown files written by
 * hand, and the cheapest place to make that a non-issue is here.
 *
 * Styling comes from the `.lesson-prose` rules in `globals.css`: the typography plugin is
 * not installed, and hand-written CSS for one surface is smaller than a dependency whose
 * defaults would need overriding anyway.
 */
export function Markdown({ children, className }: { readonly children: string; readonly className?: string }) {
  return (
    <div className={cn('lesson-prose', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
