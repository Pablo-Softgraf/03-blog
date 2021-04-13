import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import Header from '../../components/Header';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import { FiUser, FiCalendar, FiWatch } from 'react-icons/fi'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FILE } from 'node:dns';

interface Post {
  uid: string | null;
  subtitle: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>sgnews.posts</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <img src={post.data.banner.url} alt="logo" />
          <h1>{post.data.title}</h1>
          <div>
            <FiCalendar />
            <span>{post.data.author}</span>
            <FiUser />
            <span>{post.first_publication_date}</span>
            <FiWatch />
            <span>4 mins</span>
          </div>
          <div className={styles.content}>
            {post.data.content.map(content =>
              <div>
                <h1>{content.heading}</h1>
                <ul>
                  {content.body.map(body =>
                    <li>{body.text}</li>
                  )}
                </ul>
              </div>
            )
            }
          </div>
        </article>
      </main>
    </>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  //   const prismic = getPrismicClient();
  //   const posts = await prismic.query(TODO);

  //   // TODO
  return ({
    paths: [],
    fallback: "blocking",
  })
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    fetch: ['post.title', 'post.banner', 'post.author', 'post.content'],
  });
  console.log(JSON.stringify(response, null, 2));

  const post =
  {
    first_publication_date: new Date(response.first_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    }
  }
  console.log(post);

  return {
    props: { post }
  }


};
