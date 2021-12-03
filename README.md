# Detection of territories pollution using satellite images & machine learning

## Реализованная функциональность

- [ ] Идентификация разлива (машинное обучение)
- [ ] Идентификация площади разлива (машинное обучение)
- [ ] Идентификация степени опасности для окружающей среды (машинное обучение)
- [ ] Идентификация принадлежности нефтепровода
- [ ] Определение близлежайших к аварии объектов инфраструктуры, которые он связывает
- [ ] Определение близжайших населенных пунктов и маршрутов до них
- [ ] Экспорт отчета по конкретному разливу в формате PDF
- [ ] Экспорт сводного отчета по всем разливам за промежуток времени в формате XLSX

## Особенность проекта

- [ ] Дополнительный сбор спутниковых снимков из других открытых БД (GIBS) и их учет в оценке ущерба моделью
- [ ] Прогнозирование скорости увеличения площади разлива, степени ущерба

## Основной стек

- UI: JS(React/Next.js)
- Backend: Python(FastAPI)
- AI: Python(Tensoflow)
- Parser: Golang
- DB: Postgres

## Среда запуска

Linux c docker/docker-compose последних версий.
необходимао также установить пакеты:

- git
- make

## Установка

```bash
git clone https://github.com/NmadeleiDev/territoty_polution_ml_detection
cd territoty_polution_ml_detection

cp .env.example .env

docker-compose build
docker-compose up -d
```

или с использованием make

```bash
git clone https://github.com/NmadeleiDev/territoty_polution_ml_detection
cd territoty_polution_ml_detection

cp .env.example .env

make up
```

## Разработчики

1. Григорий Потемкин Backend 
2. Брехов Антон
3. Максим Харитонов
4. Никита Семенов
