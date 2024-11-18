FROM node:22-alpine AS base

COPY ./ /var/workdir/

WORKDIR /var/workdir/

ENV PNPM_VERSION=9.12.3
ENV PNPM_HOME=/usr/local/bin
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$(mktemp)" SHELL="$(which sh)" sh -s --

RUN pnpm install --frozen-lockfile

ENTRYPOINT [ "pnpm", "start" ]
