import os
from os import path
from uuid import uuid1

for n in os.listdir('./images'):
    os.rename(path.join('./images', n), path.join('./images',  '{}.{}'.format(str(uuid1().int), n.split('.')[-1])))