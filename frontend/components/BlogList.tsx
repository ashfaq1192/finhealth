interface BlogPost {
  date: string;
  title: string;
  slug: string;
  meta_description: string;
  category: string;
}

interface BlogListProps {
  posts: BlogPost[];
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-gray-400 text-center py-10">
        No posts yet — check back soon.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-gray-100 pb-6">
          <a href={`/blog/${post.slug}`} className="group block">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              {post.category}
            </span>
            <h2 className="text-lg font-semibold text-gray-900 mt-1 group-hover:underline">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(post.date)}
            </p>
            <p className="text-sm text-gray-600 mt-2">{post.meta_description}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
