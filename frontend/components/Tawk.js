import Head from 'next/head';

const TawkTo = () => (
    <Head>
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                    (function(){
                    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                    s1.async=true;
                    s1.src='https://embed.tawk.to/646f9c10ad80445890ef1f64/1h19vj8es';
                    s1.charset='UTF-8';
                    s1.setAttribute('crossorigin','*');
                    s0.parentNode.insertBefore(s1,s0);
                    })();
                `
            }}
        />
    </Head>
);

export default TawkTo;