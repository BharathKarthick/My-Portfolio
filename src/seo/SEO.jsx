import PropTypes from "prop-types";

export default function SEO({ title, description, keywords, url, image }) {
  return (
    <>
      {/* React 19 இந்த டேகுகளைத் தானாகவே <head>-க்கு ஏற்றிவிடும் */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="P. Bharath" />
      <meta name="robots" content="index, follow" />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph (WhatsApp, LinkedIn, Facebook) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string.isRequired,
  url: PropTypes.string,
  image: PropTypes.string,
};