import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Link from "next/link";

const { CONTENT_API_KEY, BLOG_URL } = process.env;

type Post = {
  title: string;
  slug: string;
};

async function getPosts() {
  const res = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpts`
  ).then((res) => res.json());

  const posts = res.posts;

  console.log(posts);

  return posts;
}

export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();
  return {
    revalidate: 10,
    props: { posts },
  };
};

const Home: React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>Fiyi's Blog</title>
      </Head>
      <h1>Hello, Welcome to Fiyi's Blog!</h1>
      <ul>
        {posts.map((post, index) => {
          return (
            <li key={post.slug}>
              <Link href="/post/[slug]" as={`/post/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
