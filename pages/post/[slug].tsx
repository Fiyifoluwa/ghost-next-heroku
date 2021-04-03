import Link from "next/link";
import styles from "../../styles/Home.module.scss";

import { useRouter } from "next/router";
import { useState } from "react";

const { BLOG_URL, CONTENT_API_KEY } = process.env;

async function getPost(slug: string) {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`
  ).then((res) => res.json());

  const posts = res.posts;

  console.log(posts);

  return posts[0];
}

// Ghost CMS Request
export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug);
  return {
    props: { post },
    revalidate: 10,
  };
};

export const getStaticPaths = () => {
  // paths which are allowed
  // fallback: try to get  static props first
  return {
    paths: [],
    fallback: true,
  };
};

type Post = {
  title: string;
  html: string;
  slug: string;
};

const Post: React.FC<{ post: Post }> = (props) => {
  console.log(props);

  const { post } = props;
  const [enableLoadComments, setEnableLoadComments] = useState<Boolean>(true);

  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  function loadComments() {
    setEnableLoadComments(false);
    // loads disqus comments
    (window as any).disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = post.slug;
    };

    const script = document.createElement("script");
    script.src = "https://fiyis-ghost-next.disqus.com/embed.js";

    document.body.appendChild(script);
  }

  return (
    <div className={styles.container}>
      <p className={styles.goback}>
        <Link href="/">
          <a>Go back home</a>
        </Link>
      </p>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>

      {enableLoadComments && (
        <p className={styles.goback} onClick={loadComments}>
          Load Comments
        </p>
      )}
      <div id="disqus_thread"></div>
    </div>
  );
};

export default Post;
