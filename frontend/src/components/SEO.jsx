import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = "RAKOTOSOLOFOHARISON Diary Honorah - Portfolio Dev Web & Réseaux",
    description = "Portfolio de RAKOTOSOLOFOHARISON Diary Honorah, étudiant en développement web et systèmes réseaux.",
    keywords = "portfolio, développeur web, réseaux, React, PHP, Java, C#, étudiant, ENI",
    image = "/og-image.jpg",
    url = "https://votre-site.com/",
    type = "website",
    noIndex = false
}) => {
    const siteTitle = "RAKOTOSOLOFOHARISON Diary Honorah - Portfolio Dev Web & Réseaux";

    // Structure JSON-LD pour Google
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "RAKOTOSOLOFOHARISON Diary Honorah",
        "jobTitle": "Étudiant en Développement Web & Réseaux",
        "url": url,
        "email": "honorahrakotosolofoharison@gmail.com",
        "sameAs": [
            "https://github.com/DiaryHonorah",
            "https://linkedin.com/in/Solofoson"
        ],
        "knowsAbout": [
            "Développement Web",
            "Réseaux Informatiques",
            "React",
            "PHP",
            "Java",
            "C#",
            "Sécurité Informatique"
        ]
    };

    return (
        <Helmet>
            <html lang="fr" />
            <title>{noIndex ? `Administration - ${siteTitle}` : title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Portfolio Dev Web & Réseaux" />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        </Helmet>
    );
};

export default SEO;