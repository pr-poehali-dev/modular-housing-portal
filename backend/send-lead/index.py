import json
import os
import smtplib
from email.mime.text import MIMEText
from email.header import Header

RECIPIENT = 'ndom39@mail.ru'


def handler(event: dict, context) -> dict:
    '''Принимает заявки с сайта (форма контактов и калькулятор) и отправляет их на почту компании'''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')

    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    comment = (body.get('comment') or '').strip()
    source = (body.get('source') or 'Форма контактов').strip()
    calc = body.get('calc') or {}

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и телефон'}),
        }

    lines = [
        f'Новая заявка с сайта ОБИТЕЛЬ',
        f'Источник: {source}',
        '',
        f'Имя: {name}',
        f'Телефон: {phone}',
    ]
    if comment:
        lines.append(f'Комментарий: {comment}')
    if calc:
        lines.append('')
        lines.append('Параметры из калькулятора:')
        if calc.get('area'):
            lines.append(f'  Площадь: {calc.get("area")} м²')
        if calc.get('floors'):
            lines.append(f'  Этажность: {calc.get("floors")}')
        if calc.get('finish'):
            lines.append(f'  Отделка: {calc.get("finish")}')
        if calc.get('options'):
            lines.append(f'  Опции: {calc.get("options")}')
        if calc.get('total'):
            lines.append(f'  Предварительная стоимость: {calc.get("total")}')

    text = '\n'.join(lines)

    smtp_host = os.environ.get('SMTP_HOST')
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    if not (smtp_host and smtp_user and smtp_password):
        return {
            'statusCode': 500,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'SMTP не настроен'}),
        }

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header(f'Заявка с сайта: {name}', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = RECIPIENT
    msg['Reply-To'] = smtp_user

    with smtplib.SMTP_SSL(smtp_host, 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, [RECIPIENT], msg.as_string())

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True}),
    }
