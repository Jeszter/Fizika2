import React, { useEffect } from 'react';

const MathJaxProvider = ({ children }) => {
    useEffect(() => {
        // Загружаем MathJax
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;
        script.id = 'MathJax-script';

        const config = document.createElement('script');
        config.type = 'text/x-mathjax-config';
        config.text = `
            MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                    displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                    processEscapes: true,
                    packages: {'[+]': ['ams']}
                },
                options: {
                    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                    ignoreHtmlClass: 'tex2jax_ignore',
                    processHtmlClass: 'tex2jax_process'
                },
                startup: {
                    pageReady: () => {
                        return MathJax.startup.defaultPageReady();
                    }
                }
            };
        `;

        document.head.appendChild(config);
        document.head.appendChild(script);

        return () => {
            // Очистка при размонтировании
            const existingScript = document.getElementById('MathJax-script');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return <>{children}</>;
};

export default MathJaxProvider;