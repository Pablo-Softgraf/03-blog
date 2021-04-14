import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Head from 'next/head';

import { RichText } from 'prismic-dom';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useEffect, useState } from 'react';


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

export default function Home({ postsPagination }: HomeProps) {
  const { next_page, results } = postsPagination;
  const [posts, setPosts] = useState(results)



  console.log(next_page);
  /*
  useEffect(() => {
    fetch(next_page)
      .then(response => response.json())
      .then(data => setPosts(data.results))
  }, [postsPagination]); //sempre se faz necessário a passagem do parametro
  */

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
                <span>{
                  format(
                    new Date(post.first_publication_date),
                    "dd MMM yyyy",
                    {
                      locale: ptBR,
                    }
                  )
                }</span>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
            </a>
          </div>
        ))}
        <div>
          <button
            onClick={() => fetchNext()}
          >
            Carregar mais posts
          </button>
        </div>
      </main>
    </>
  )

  async function fetchNext() {
    await fetch(next_page)
      .then(response => response.json())
      .then(data => { setPosts(data.results) })
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 1,
  })
  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })
  console.log(postsResponse);

  return {
    props: {
      postsPagination: postsResponse
    }
  }
};
