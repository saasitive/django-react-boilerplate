FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

WORKDIR /app
ADD ./backend/requirements.txt /app/backend/

RUN pip install --upgrade pip && \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    pip install gunicorn && \
    pip install -r backend/requirements.txt --no-cache-dir && \
    apk --purge del .build-deps


ADD ./backend /app/backend
ADD ./docker /app/docker