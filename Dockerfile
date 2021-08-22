FROM httpd:2.4
COPY ./public_html/ /usr/local/apache2/htdocs/
EXPOSE 80
ENV VIRTUAL_HOST=wunderplumbing.com.au
ENV LETSENCRYPT_HOST=wunderplumbing.com.au
