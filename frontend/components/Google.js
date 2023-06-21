import Script from 'next/script'

const GoogleTagManager = () => {
    return (
        <div>
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-6L10JWMQRR"
            />
            <Script strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6L10JWMQRR');
        `}
            </Script>
        </div>
    );
}

export default GoogleTagManager;
