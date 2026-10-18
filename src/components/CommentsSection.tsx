import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  Send, 
  Check, 
  Copy, 
  ShieldCheck, 
  Terminal, 
  Code, 
  Bold, 
  Quote, 
  Eye, 
  Edit3, 
  Sparkles,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Comment } from '../types';

interface CommentsSectionProps {
  articleId: string;
  articleTitle: string;
  comments: Comment[];
  onAddComment: (commentData: Omit<Comment, 'id' | 'date'>) => void;
  onAddReply: (parentCommentId: string, replyData: Omit<Comment, 'id' | 'date'>) => void;
  onToggleLike: (commentId: string, isReply?: boolean, parentId?: string) => void;
}

const ROLES = [
  'Security Researcher',
  'DevOps / SRE',
  'Penetration Tester',
  'Software Engineer',
  'Sysadmin',
  'Verified Reader',
  'Student / Enthusiast'
];

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  articleId,
  articleTitle,
  comments,
  onAddComment,
  onAddReply,
  onToggleLike
}) => {
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [copiedCommentId, setCopiedCommentId] = useState<string | null>(null);
  const [humanAnswer, setHumanAnswer] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simple dynamic verification challenge
  const [challenge] = useState(() => {
    const num1 = Math.floor(Math.random() * 12) + 5;
    const num2 = Math.floor(Math.random() * 8) + 3;
    return { num1, num2, expected: num1 + num2 };
  });

  const totalCommentCount = useMemo(() => {
    let count = comments.length;
    comments.forEach(c => {
      if (c.replies) count += c.replies.length;
    });
    return count;
  }, [comments]);

  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortBy === 'top') {
      return list.sort((a, b) => b.likes - a.likes);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [comments, sortBy]);

  const handleInsertSnippet = (wrapper: string, placeholder = 'code') => {
    setContent(prev => `${prev}\n${wrapper}${placeholder}${wrapper}\n`);
  };

  const handleInsertBlock = (language = 'bash') => {
    setContent(prev => `${prev}\n\`\`\`${language}\n# paste command here\n\`\`\`\n`);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');

    if (!author.trim()) {
      setSecurityError('Please provide a researcher handle or username.');
      return;
    }
    if (!content.trim()) {
      setSecurityError('Comment body cannot be empty.');
      return;
    }
    if (parseInt(humanAnswer.trim(), 10) !== challenge.expected) {
      setSecurityError(`Human verification failed. What is ${challenge.num1} + ${challenge.num2}?`);
      return;
    }

    onAddComment({
      author: author.trim(),
      role,
      avatar: '',
      badge: 'Reader',
      content: content.trim(),
      likes: 0
    });

    setContent('');
    setHumanAnswer('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleSubmitReply = (parentCommentId: string) => {
    if (!replyContent.trim()) return;
    const finalAuthor = replyAuthor.trim() || author.trim() || 'Anonymous Researcher';

    onAddReply(parentCommentId, {
      author: finalAuthor,
      role: 'Contributor',
      avatar: '',
      badge: 'Community',
      content: replyContent.trim(),
      likes: 0
    });

    setReplyContent('');
    setReplyingToId(null);
  };

  const handleShareComment = (commentId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#comment-${commentId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedCommentId(commentId);
      setTimeout(() => setCopiedCommentId(null), 2500);
    }
  };

  const renderFormattedContent = (text: string) => {
    // Process code blocks, inline code, bolding, and quotes cleanly
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lIdx) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${lIdx}`} className="p-3 bg-[#02050c] rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto my-2">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.trim().startsWith('>')) {
        elements.push(
          <blockquote key={`quote-${lIdx}`} className="pl-3 border-l-2 border-cyan-500/70 text-slate-400 italic text-xs my-1.5 font-sans">
            {line.replace(/^>\s*/, '')}
          </blockquote>
        );
        return;
      }

      // Inline code and bold parsing
      const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      const lineNode = parts.map((part, pIdx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code key={pIdx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[11px]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={pIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      elements.push(
        <p key={`p-${lIdx}`} className="leading-relaxed text-slate-200 text-xs sm:text-sm font-sans my-1">
          {lineNode}
        </p>
      );
    });

    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre key="code-final" className="p-3 bg-[#02050c] rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto my-2">
          <code>{codeBlockContent.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  return (
    <section id="community-discussion" className="space-y-6 pt-8 border-t border-slate-800 scroll-mt-24">
      {/* Discussion Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans flex items-center gap-2">
                <span>Peer Reviews &amp; Discussion</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono font-bold">
                  {totalCommentCount}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Audited technical perspectives, deployment feedback, and defense benchmarks from the security community.
              </p>
            </div>
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-[#050811] p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              sortBy === 'top' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Top Upvoted</span>
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              sortBy === 'newest' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Newest</span>
          </button>
        </div>
      </div>

      {/* Main Comment Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#050811] border border-slate-800 space-y-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Contribute to this Technical Blueprint</span>
          </div>

          <div className="flex items-center gap-1 bg-[#02050c] p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-2.5 py-0.5 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'write' ? 'bg-slate-800 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-0.5 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-slate-800 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmitComment} className="space-y-4">
          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Your Name or Handle *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex or alex_sec"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#02050c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Discipline / Background (Optional)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#02050c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-cyan-500"
              >
                {ROLES.map(r => (
                  <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Formatting Toolbar */}
          {activeTab === 'write' && (
            <div className="flex items-center flex-wrap gap-1 pt-1 pb-1 text-slate-400 border-b border-slate-800/60">
              <button
                type="button"
                onClick={() => handleInsertSnippet('**', 'bold text')}
                title="Bold"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertSnippet('`', 'command_or_path')}
                title="Inline Code"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('bash')}
                title="Code Block"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleInsertSnippet('> ', 'quote text')}
                title="Blockquote"
                className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-600 ml-auto">
                Markdown &amp; Shell snippets supported
              </span>
            </div>
          )}

          {/* Body Textarea or Preview */}
          {activeTab === 'write' ? (
            <textarea
              rows={4}
              placeholder="Share benchmarks, edge-case observations, or questions about this blueprint..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#02050c] border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 font-sans placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed font-normal"
              required
            />
          ) : (
            <div className="min-h-[100px] p-4 bg-[#02050c] border border-slate-800 rounded-xl">
              {content.trim() ? (
                renderFormattedContent(content)
              ) : (
                <span className="text-xs text-slate-600 italic">No content typed yet for preview.</span>
              )}
            </div>
          )}

          {/* Human Check & Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-Spam: {challenge.num1} + {challenge.num2} =</span>
              </div>
              <input
                type="number"
                placeholder="?"
                value={humanAnswer}
                onChange={(e) => setHumanAnswer(e.target.value)}
                className="w-16 bg-[#02050c] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 text-center"
                required
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {securityError && (
                <span className="text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {securityError}
                </span>
              )}
              {submitSuccess && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" />
                  Comment published!
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Comment</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Rendered Comments List */}
      <div className="space-y-4 pt-2">
        {sortedComments.length === 0 ? (
          <div className="p-8 text-center bg-[#050811] border border-slate-800 rounded-2xl space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">No comments yet</p>
            <p className="text-xs text-slate-500">Be the first to share your thoughts, feedback, or findings.</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div
              key={comment.id}
              id={`comment-${comment.id}`}
              className="p-5 rounded-2xl bg-[#050811] border border-slate-800/90 space-y-3.5 hover:border-slate-700/80 transition-colors shadow-sm"
            >
              {/* Comment Author Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800/90 text-cyan-400 font-mono text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white font-mono">
                        {comment.author}
                      </span>
                      {comment.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${
                          comment.badge === 'Author' 
                            ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300' 
                            : comment.badge === 'Verified Contributor'
                            ? 'bg-cyan-950/80 border-cyan-600 text-cyan-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}>
                          {comment.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans mt-0.5">
                      {comment.role && <span className="text-slate-400">{comment.role}</span>}
                      <span>•</span>
                      <time dateTime={comment.date} className="font-mono text-slate-500">{comment.date}</time>
                    </div>
                  </div>
                </div>

                {/* Direct Share Link button */}
                <button
                  onClick={() => handleShareComment(comment.id)}
                  title="Copy direct link to comment"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                >
                  {copiedCommentId === comment.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Comment Body */}
              <div className="text-slate-200 pl-0 sm:pl-13 text-xs sm:text-sm font-sans space-y-1">
                {renderFormattedContent(comment.content)}
              </div>

              {/* Action Buttons: Like, Reply */}
              <div className="flex items-center gap-3 pt-1 pl-0 sm:pl-13 border-t border-slate-800/40">
                <button
                  onClick={() => onToggleLike(comment.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    comment.likedByMe
                      ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${comment.likedByMe ? 'fill-emerald-400' : ''}`} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => {
                    setReplyingToId(replyingToId === comment.id ? null : comment.id);
                    setReplyContent('');
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Nested Inline Reply Box */}
              {replyingToId === comment.id && (
                <div className="ml-0 sm:ml-13 p-4 rounded-xl bg-[#02050c] border border-cyan-900/60 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span className="flex items-center gap-1.5">
                      <Reply className="w-3 h-3" />
                      Replying to @{comment.author}
                    </span>
                    <button
                      onClick={() => setReplyingToId(null)}
                      className="text-slate-500 hover:text-slate-300 text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Your handle (e.g. dev_sec)"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    className="w-full bg-[#050811] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />

                  <textarea
                    rows={2}
                    placeholder="Write a technical response..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full bg-[#050811] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Nested Replies List */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-2 sm:ml-10 pl-3 sm:pl-4 border-l-2 border-slate-800/80 space-y-3 pt-2">
                  {comment.replies.map((rep) => (
                    <div
                      key={rep.id}
                      id={`comment-${rep.id}`}
                      className="p-3.5 rounded-xl bg-[#040712] border border-slate-800/70 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                            {rep.author ? rep.author.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-bold text-white font-mono text-xs">{rep.author}</span>
                          {rep.badge && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              rep.badge === 'Author' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-900 text-slate-400'
                            }`}>
                              {rep.badge}
                            </span>
                          )}
                          <time dateTime={rep.date} className="text-[10px] text-slate-500 font-mono">{rep.date}</time>
                        </div>

                        <button
                          onClick={() => handleShareComment(rep.id)}
                          className="text-slate-500 hover:text-white p-1"
                        >
                          {copiedCommentId === rep.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="text-slate-300 font-sans leading-relaxed pl-8">
                        {renderFormattedContent(rep.content)}
                      </div>

                      <div className="pl-8 pt-1">
                        <button
                          onClick={() => onToggleLike(rep.id, true, comment.id)}
                          className={`px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1 transition-all ${
                            rep.likedByMe
                              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-2.5 h-2.5 ${rep.likedByMe ? 'fill-emerald-400' : ''}`} />
                          <span>{rep.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
