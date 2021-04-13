
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Head from 'next/head';


import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: PostPagination) {
  const { next_page, results } = props;

  //console.log(results);
  //console.log(next_page);
  const posts = results;

  return (
    <>
      <Head>
        <title>Inicio | sg.news</title>
      </Head>

      <main className={styles.container}>
        <img src="spacetravelling.svg" alt="logo" />

        {posts.map(post => (
          <div className={styles.posts} key={post.uid}>
            <a href={`post/${post.uid}`}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div>
                <FiCalendar />
                <span>{post.first_publication_date}</span>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
            </a>
          </div>
        ))}

      </main>
    </>
  )


}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 2,
  })
  //console.log(JSON.stringify(postsResponse));

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  return {
    props: { results }
  }
};
