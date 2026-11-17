"""Gera as capturas dos mockups usadas na landing (public/img/*.webp).

Uso (com o site já construído e servido):
    npm run build && npm run preview &
    python3 scripts/capturar-telas.py http://localhost:4173

Precisa de Python com playwright e Pillow, e de um Chrome instalado.
Cada captura sai em 1x e em 2x, para telas de alta densidade.
"""
import io, re, sys
from PIL import Image, ImageOps
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173').rstrip('/') + '/jornada/'
CHROME = sys.argv[2] if len(sys.argv) > 2 else None
OUT = 'public/img/'
# Esconde o que é só do modo demonstração (engrenagem e avisos temporários).
CSS = 'button[aria-label="Painel de demonstração"],.nao-imprimir.pointer-events-none{display:none!important}'


def salvar(png, nome, w, h, cinza=False):
    im = Image.open(io.BytesIO(png)).convert('RGB')
    alvo = w * 2, h * 2
    # Corta no formato pedido a partir do topo, depois reduz.
    ratio = alvo[0] / alvo[1]
    corte_h = min(im.height, round(im.width / ratio))
    im = im.crop((0, 0, im.width, corte_h))
    if cinza:
        im = ImageOps.grayscale(im).convert('RGB')
    im.resize(alvo, Image.LANCZOS).save(f'{OUT}{nome}@2x.webp', 'WEBP', quality=78, method=6)
    im.resize((w, h), Image.LANCZOS).save(f'{OUT}{nome}.webp', 'WEBP', quality=82, method=6)
    print('ok', nome)


with sync_playwright() as p:
    br = p.chromium.launch(executable_path=CHROME, args=['--no-sandbox'])

    # ---- Celular (390 x 844) ----
    pg = br.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2).new_page()
    def ir(hash_, espera=700):
        pg.evaluate(f'location.hash = {hash_!r}'); pg.wait_for_timeout(espera)
    pg.goto(BASE); pg.wait_for_selector('h1'); pg.add_style_tag(content=CSS)
    pg.get_by_role('button', name=re.compile('Módulo 4')).first.click(); pg.wait_for_timeout(500)
    ir('#/triagem/demo/modulo/4?p=vida_sexual')
    salvar(pg.screenshot(), 'paciente-pergunta', 390, 844)
    ir('#/triagem/demo/modulo/3?p=motivo')
    pg.get_by_text('Dor ou desconforto').click(); pg.mouse.move(0, 0); pg.wait_for_timeout(300)
    salvar(pg.screenshot(), 'paciente-sintomas', 390, 844)
    ir('#/triagem/demo')
    salvar(pg.screenshot(), 'paciente-boas-vindas', 390, 844)

    # ---- Notebook (1280 x 800) ----
    pg = br.new_context(viewport={'width': 1280, 'height': 800}, device_scale_factor=1.5).new_page()
    def ir(hash_, espera=700):
        pg.evaluate(f'location.hash = {hash_!r}'); pg.wait_for_timeout(espera)
    pg.goto(BASE); pg.wait_for_selector('h1'); pg.add_style_tag(content=CSS)
    pg.get_by_role('button', name=re.compile('Entrar como Médica')).click(); pg.wait_for_timeout(800)
    pg.mouse.move(0, 0)
    salvar(pg.screenshot(), 'painel-triagens', 960, 600)
    ir('#/painel/triagem/t1')
    salvar(pg.screenshot(), 'painel-detalhe', 960, 600)
    ir('#/painel/triagem/t1/relatorio')
    salvar(pg.screenshot(), 'painel-relatorio', 960, 600)
    ir('#/painel/convites/novo')
    pg.get_by_label('Nome completo').fill('Maria Demonstração')
    pg.get_by_role('button', name='Usar CPF de teste').click()
    pg.get_by_label('Data de nascimento').fill('15032000')
    pg.get_by_label('Telefone com WhatsApp').fill('11900000000')
    pg.get_by_label('Data da consulta').fill('20112026'); pg.get_by_label('Hora da consulta').fill('1430')
    pg.get_by_role('button', name='Criar convite').click(); pg.wait_for_timeout(700); pg.mouse.move(0, 0)
    salvar(pg.screenshot(), 'painel-convite', 960, 600)

    # ---- Folha A4 do relatório, como sai na impressão (sem a moldura do painel) ----
    pg = br.new_context(viewport={'width': 794, 'height': 1123}, device_scale_factor=2).new_page()
    pg.goto(BASE); pg.wait_for_selector('h1'); pg.add_style_tag(content=CSS)
    pg.get_by_role('button', name=re.compile('Entrar como Médica')).click(); pg.wait_for_timeout(800)
    pg.evaluate("location.hash = '#/painel/triagem/t1/relatorio'"); pg.wait_for_timeout(900)
    pg.emulate_media(media='print'); pg.wait_for_timeout(300)
    folha = pg.locator('.folha').first.screenshot()
    salvar(folha, 'relatorio-folha', 560, 792)
    salvar(folha, 'relatorio-folha-pb', 560, 792, cinza=True)
    br.close()
