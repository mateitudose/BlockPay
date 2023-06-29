import Head from 'next/head';

const Intercom = () => (
    <Head>
        <script
            dangerouslySetInnerHTML={{
                __html:
                    `
                        window.intercomSettings = {
                            api_base: "https://api-iam.intercom.io",
                            app_id: "v0bx84zb"
                        };
                    `
            }}
        />
        <script
            dangerouslySetInnerHTML={{
                __html:
                    `
                        (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/v0bx84zb';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
                    `
            }}
        />
    </Head>
);

export default Intercom;