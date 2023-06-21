import Head from 'next/head';

const HotJar = () => (
    <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6L10JWMQRR" />
        <script
            dangerouslySetInnerHTML={{
                __html:
                    `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-6L10JWMQRR');
                    `
            }}
        />
    </Head>
);

export default HotJar;