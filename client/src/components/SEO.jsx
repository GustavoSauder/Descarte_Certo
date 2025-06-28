import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author = 'Descarte Certo Team',
  lang = 'pt-BR',
}) => {
  const siteTitle = 'Descarte Certo - Plataforma de Educação Ambiental';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Plataforma Completa de Educação Ambiental com Gamificação Avançada. Aprenda sobre reciclagem, participe de desafios e contribua para um futuro sustentável.';
  const defaultImage = '/og-image.jpg'; // Você precisará criar esta imagem

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={lang} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={lang} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Canonical URL */}
      <link rel="canonical" href={url || window.location.href} />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Theme Color */}
      <meta name="theme-color" content="#10B981" />
      <meta name="msapplication-TileColor" content="#10B981" />
    </Helmet>
  );
};

export default SEO; 