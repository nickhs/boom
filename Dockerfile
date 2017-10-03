FROM alpine

RUN apk update
RUN apk add nginx

EXPOSE 80

RUN mkdir /run/nginx
RUN mkdir -p /srv/boomjs/build

COPY ./ops/nginx.conf /etc/nginx/nginx.conf

COPY emoji_icons /srv/boomjs/emoji_icons
COPY demo.html /srv/boomjs
COPY demo.css /srv/boomjs
COPY build /srv/boomjs/build

CMD nginx
