FROM continuumio/anaconda3

RUN python -m pip install --upgrade pip
RUN apt update && apt install -y uvicorn && pip install fastapi[all] pandas psycopg2-binary tensorflow==2.2.0 scikit-image Pillow sentinelhub
RUN mkdir -p /app/ && apt -y install cron && mkdir -p /service_data/images

COPY . /app
WORKDIR /app

EXPOSE 2222

# CMD uvicorn main:app --reload --port 2222 --host 0.0.0.0 --log-level debug
CMD uvicorn main:app --port 2222 --host 0.0.0.0 --log-level debug

