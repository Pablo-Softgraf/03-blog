import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import Header from '../../components/Header';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
      <main>
        <div>
          <a href="#">
            <strong>{post.data.title}</strong>
            <p>{post.data.author}</p>
            <div>
              <span>{post.first_publication_date}</span>
              {post.data.content.map(item =>
                <p>{item.heading}</p>
              )
              }
            </div>
            <div>
              <img src={post.data.banner.url} alt="banner" />
            </div>
          </a>
        </div>
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
      /*
      content: response.data.content.map(item => {
        return {
          heading: item.heading,
          body: item.body,
        };
      }),
      */
      //content: response.data.content,
    }
  }
  console.log(post);

  return {
    props: { post }
  }


};
