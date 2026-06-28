import { useState, useMemo, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import func2url from '../../backend/func2url.json';

const LEAD_URL = func2url['send-lead'];

const IMG_HERO = 'https://cdn.poehali.dev/projects/c099291d-a9d9-4a9c-a7b2-910285c45bb3/bucket/8199682b-339b-4ba6-9495-5fc2f0ff9108.jpeg';
const IMG_FOREST = 'https://cdn.poehali.dev/projects/c099291d-a9d9-4a9c-a7b2-910285c45bb3/bucket/ef515bd1-2016-4d31-8db3-da23d32ed95a.jpeg';
const IMG_INTERIOR = 'https://cdn.poehali.dev/projects/c099291d-a9d9-4a9c-a7b2-910285c45bb3/bucket/90341acb-5a2a-4717-be5c-ecec04b114ba.jpeg';
const IMG_DECK = 'https://cdn.poehali.dev/projects/c099291d-a9d9-4a9c-a7b2-910285c45bb3/bucket/729bea55-8547-407d-9164-b7a3da595ea4.jpeg';
const IMG_BLACK = 'https://cdn.poehali.dev/projects/c099291d-a9d9-4a9c-a7b2-910285c45bb3/bucket/d11052c8-8c96-4341-ab42-4dc70c739b63.jpeg';
const IMG_VILLA = 'https://cdn.poehali.dev/projects/c099291d-a9d9-4a9c-a7b2-910285c45bb3/bucket/8199682b-339b-4ba6-9495-5fc2f0ff9108.jpeg';

const NAV = [
  { label: 'Проекты', href: '#projects' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Услуги', href: '#services' },
  { label: 'Калькулятор', href: '#calc' },
  { label: 'О компании', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
];

const PROJECTS = [
  { name: 'НОРД', area: 30, price: 'от 1 800 000 ₽', img: IMG_FOREST, desc: 'Компактный дом для двоих' },
  { name: 'ФЬОРД', area: 64, price: 'от 3 480 000 ₽', img: IMG_HERO, desc: 'Семейный дом с террасой' },
  { name: 'ХЮГГЕ', area: 88, price: 'от 6 160 000 ₽', img: IMG_INTERIOR, desc: 'Просторный дом с панорамой' },
];

const SERVICES = [
  { icon: 'PencilRuler', title: 'Проектирование', text: 'Индивидуальный проект под ваш участок и образ жизни' },
  { icon: 'Factory', title: 'Заводское производство', text: 'Модули собираются в цехе — независимо от погоды' },
  { icon: 'Truck', title: 'Доставка и монтаж', text: 'Установка дома на участке за один день' },
  { icon: 'KeyRound', title: 'Сдача под ключ', text: 'Отделка, инженерия и мебель — въезжайте сразу' },
];

const GALLERY = [
  { src: IMG_HERO, label: 'Дом ФЬОРД, 64 м²' },
  { src: IMG_FOREST, label: 'Дом НОРД, 36 м²' },
  { src: IMG_INTERIOR, label: 'Интерьер ХЮГГЕ' },
  { src: IMG_DECK, label: 'Дом с террасой, 72 м²' },
  { src: IMG_BLACK, label: 'Горный дом, 48 м²' },
  { src: IMG_VILLA, label: 'Вилла ПРЕМИУМ, 120 м²' },
];

const PRESETS = [
  { name: 'НОРД', area: 36, floors: 1, finish: 'shell', opts: [], img: IMG_FOREST, desc: 'Компактный · 36 м²' },
  { name: 'ФЬОРД', area: 64, floors: 1, finish: 'comfort', opts: ['terrace'], img: IMG_HERO, desc: 'Семейный · 64 м²' },
  { name: 'ХЮГГЕ', area: 88, floors: 2, finish: 'comfort', opts: ['terrace', 'panoramic'], img: IMG_INTERIOR, desc: 'Просторный · 88 м²' },
  { name: 'ВИЛЛА', area: 120, floors: 2, finish: 'premium', opts: ['terrace', 'panoramic', 'smart', 'furniture'], img: IMG_VILLA, desc: 'Премиум · 120 м²' },
];

const FINISHES = [
  { id: 'shell', label: 'Тёплый контур', price: 58000 },
  { id: 'comfort', label: 'Комфорт', price: 70000 },
  { id: 'premium', label: 'Премиум', price: 89000 },
];

const OPTIONS = [
  { id: 'terrace', label: 'Терраса', price: 320000 },
  { id: 'panoramic', label: 'Панорамное остекление', price: 480000 },
  { id: 'smart', label: 'Умный дом', price: 250000 },
  { id: 'furniture', label: 'Меблировка', price: 540000 },
];

const formatPrice = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const Index = () => {
  const { toast } = useToast();
  const [area, setArea] = useState(64);
  const [floors, setFloors] = useState(1);
  const [finish, setFinish] = useState('comfort');
  const [opts, setOpts] = useState<string[]>(['terrace']);

  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [sending, setSending] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const closeLightbox = () => setLightbox(null);
  const prevPhoto = () => setLightbox((i) => (i === null ? 0 : (i - 1 + GALLERY.length) % GALLERY.length));
  const nextPhoto = () => setLightbox((i) => (i === null ? 0 : (i + 1) % GALLERY.length));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  const total = useMemo(() => {
    const f = FINISHES.find((x) => x.id === finish)!;
    const base = area * f.price * (floors === 2 ? 0.92 : 1) * floors;
    const extra = OPTIONS.filter((o) => opts.includes(o.id)).reduce((s, o) => s + o.price, 0);
    return Math.round(base + extra);
  }, [area, floors, finish, opts]);

  const toggleOpt = (id: string) =>
    setOpts((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const sendLead = async (payload: Record<string, unknown>) => {
    const res = await fetch(LEAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Не удалось отправить заявку');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: 'Заполните имя и телефон', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      await sendLead({ ...form, source: 'Форма контактов' });
      toast({ title: 'Заявка отправлена!', description: 'Мы свяжемся с вами в ближайшее время.' });
      setForm({ name: '', phone: '', comment: '' });
    } catch (err) {
      toast({ title: 'Ошибка', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleCalcSubmit = async () => {
    const name = window.prompt('Ваше имя:');
    if (!name) return;
    const phone = window.prompt('Ваш телефон:');
    if (!phone) return;
    setSending(true);
    try {
      await sendLead({
        name,
        phone,
        source: 'Калькулятор',
        calc: {
          area: `${area} м²`,
          floors: floors === 2 ? '2 этажа' : '1 этаж',
          finish: FINISHES.find((x) => x.id === finish)?.label,
          options: OPTIONS.filter((o) => opts.includes(o.id)).map((o) => o.label).join(', ') || '—',
          total: formatPrice(total),
        },
      });
      toast({ title: 'Заявка отправлена!', description: 'Менеджер рассчитает точную стоимость и свяжется с вами.' });
    } catch (err) {
      toast({ title: 'Ошибка', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="font-display text-2xl font-semibold tracking-mega">НОВЫЙ ДОМ</a>
          <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">{n.label}</a>
            ))}
          </nav>
          <Button asChild variant="outline" className="rounded-none border-foreground/20 hidden sm:inline-flex">
            <a href="#contacts">Связаться</a>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
        <img src={IMG_HERO} alt="Модульный дом" className="absolute inset-0 w-full h-full object-cover animate-image-reveal" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <div className="container relative z-10 pb-20 text-white">
          <p className="text-sm tracking-[0.3em] uppercase mb-6 animate-fade-up reveal-delay-1">Модульные дома под ключ</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl animate-fade-up reveal-delay-2">
            Дом, в котором живёт тишина
          </h1>
          <p className="mt-8 max-w-md text-white/80 text-lg animate-fade-up reveal-delay-3">
            Модульные дома привлекают доступной стоимостью и быстрым строительством. От проекта до новоселья — 60 дней.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up reveal-delay-4">
            <Button asChild size="lg" className="rounded-none bg-white text-black hover:bg-white/90">
              <a href="#projects">Смотреть проекты</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white">
              <a href="#calc">Рассчитать стоимость</a>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border">
        <div className="container grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { n: '120+', l: 'построенных домов' },
            { n: '60', l: 'дней до новоселья' },
            { n: '15', l: 'лет гарантии' },
            { n: '100%', l: 'фиксированная цена' },
          ].map((s) => (
            <div key={s.l} className="py-10 px-4 text-center">
              <div className="font-display text-4xl md:text-5xl font-semibold">{s.n}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 md:py-32">
        <div className="container">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Проекты</p>
              <h2 className="font-display text-4xl md:text-6xl">Готовые решения</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">Каждый проект можно адаптировать под ваш участок и бюджет.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <article key={p.name} className="group hover-lift">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 text-xs tracking-widest">{p.area} м²</div>
                </div>
                <div className="pt-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl font-semibold tracking-wide">{p.name}</h3>
                    <span className="text-sm text-muted-foreground">{p.price}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32 bg-secondary">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Услуги</p>
          <h2 className="font-display text-4xl md:text-6xl mb-14">Полный цикл</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-secondary p-8 hover:bg-background transition-colors duration-300">
                <Icon name={s.icon} size={32} className="text-accent" />
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calc" className="py-24 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Калькулятор</p>
              <h2 className="font-display text-4xl md:text-6xl mb-6">Стоимость вашего дома</h2>
              <p className="text-muted-foreground mb-10 max-w-md">
                Подберите параметры — расчёт обновится мгновенно. Итоговая цена фиксируется в договоре.
              </p>
              <div className="border border-foreground p-8 bg-foreground text-primary-foreground">
                <div className="text-sm uppercase tracking-widest text-primary-foreground/60">Предварительная стоимость</div>
                <div className="font-display text-5xl md:text-6xl font-semibold mt-3">{formatPrice(total)}</div>
                <Button onClick={handleCalcSubmit} disabled={sending} size="lg" className="mt-8 w-full rounded-none bg-white text-black hover:bg-white/90">
                  {sending ? 'Отправка…' : 'Получить точный расчёт'}
                </Button>
              </div>
            </div>

            <div className="space-y-10">
              {/* presets */}
              <div>
                <div className="font-display text-2xl mb-4">Выберите проект</div>
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map((p) => {
                    const isActive = area === p.area && floors === p.floors && finish === p.finish;
                    return (
                      <button key={p.name} onClick={() => { setArea(p.area); setFloors(p.floors); setFinish(p.finish); setOpts(p.opts); }}
                        className={`relative overflow-hidden text-left transition-all duration-300 group border ${isActive ? 'border-foreground' : 'border-border hover:border-foreground/40'}`}>
                        <img src={p.img} alt={p.name} className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/50' : 'bg-black/30 group-hover:bg-black/40'}`} />
                        <div className="absolute inset-0 flex flex-col justify-end p-3">
                          <div className="text-white font-display text-lg leading-none">{p.name}</div>
                          <div className="text-white/70 text-xs mt-1">{p.desc}</div>
                        </div>
                        {isActive && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                            <Icon name="Check" size={12} className="text-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Параметры ниже настраиваются независимо от проекта</p>
              </div>

              {/* area */}
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-display text-2xl">Площадь</span>
                  <span className="text-accent font-medium">{area} м²</span>
                </div>
                <input
                  type="range" min={24} max={140} step={4} value={area}
                  onChange={(e) => setArea(+e.target.value)}
                  className="w-full accent-foreground h-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>24 м²</span><span>140 м²</span>
                </div>
              </div>

              {/* floors */}
              <div>
                <div className="font-display text-2xl mb-4">Этажность</div>
                <div className="grid grid-cols-2 gap-px bg-border">
                  {[1, 2].map((f) => (
                    <button key={f} onClick={() => setFloors(f)}
                      className={`py-4 text-sm transition-colors ${floors === f ? 'bg-foreground text-primary-foreground' : 'bg-background hover:bg-secondary'}`}>
                      {f} этаж{f === 2 ? 'а' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* finish */}
              <div>
                <div className="font-display text-2xl mb-4">Отделка</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border">
                  {FINISHES.map((f) => (
                    <button key={f.id} onClick={() => setFinish(f.id)}
                      className={`py-4 px-3 text-left transition-colors ${finish === f.id ? 'bg-foreground text-primary-foreground' : 'bg-background hover:bg-secondary'}`}>
                      <div className="text-sm font-medium">{f.label}</div>
                      <div className={`text-xs mt-1 ${finish === f.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{formatPrice(f.price)}/м²</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* options */}
              <div>
                <div className="font-display text-2xl mb-4">Опции</div>
                <div className="space-y-px bg-border">
                  {OPTIONS.map((o) => {
                    const active = opts.includes(o.id);
                    return (
                      <button key={o.id} onClick={() => toggleOpt(o.id)}
                        className={`w-full flex items-center justify-between py-4 px-4 transition-colors ${active ? 'bg-foreground text-primary-foreground' : 'bg-background hover:bg-secondary'}`}>
                        <span className="flex items-center gap-3 text-sm">
                          <span className={`w-5 h-5 flex items-center justify-center border ${active ? 'border-white' : 'border-foreground/30'}`}>
                            {active && <Icon name="Check" size={14} />}
                          </span>
                          {o.label}
                        </span>
                        <span className={`text-sm ${active ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>+{formatPrice(o.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 md:py-32 bg-secondary">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Галерея</p>
          <h2 className="font-display text-4xl md:text-6xl mb-14">Реализованные дома</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY.map((item, i) => (
              <button key={i} onClick={() => setLightbox(i)}
                className="overflow-hidden group relative aspect-square block w-full focus:outline-none">
                <img src={item.src} alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-4">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transition-transform">{item.label}</span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <Icon name="Maximize2" size={14} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2">
            <Icon name="ChevronLeft" size={40} />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full mx-16 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY[lightbox].src} alt={GALLERY[lightbox].label}
              className="max-h-[80vh] w-auto max-w-full object-contain" />
            <p className="text-white/60 text-sm tracking-widest uppercase">{GALLERY[lightbox].label}</p>
            <div className="flex gap-2 mt-1">
              {GALLERY.map((_, i) => (
                <button key={i} onClick={() => setLightbox(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightbox ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2">
            <Icon name="ChevronRight" size={40} />
          </button>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2">
            <Icon name="X" size={28} />
          </button>
        </div>
      )}

      {/* ABOUT */}
      <section id="about" className="py-24 md:py-32">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="overflow-hidden aspect-[4/3]">
            <img src={IMG_INTERIOR} alt="О компании" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">О компании</p>
            <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">Мы строим дома, которые остаются с вами</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              С 2014 года мы проектируем и строим модульные дома. Их главное преимущество — доступная стоимость без потери качества. Заводское производство гарантирует точность и скорость сборки.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-10">
              {[{ n: '2014', l: 'год основания' }, { n: '38', l: 'человек в команде' }, { n: '4', l: 'региона работы' }].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-semibold">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 md:py-32 bg-foreground text-primary-foreground">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Контакты</p>
            <h2 className="font-display text-4xl md:text-6xl mb-8 leading-tight">Обсудим ваш будущий дом</h2>
            <div className="space-y-5 text-primary-foreground/80">
              <a href="tel:+79114896920" className="flex items-center gap-4 hover:text-white transition-colors">
                <Icon name="Phone" size={20} /> +7 (911) 489-69-20
              </a>
              <a href="mailto:ndom39@mail.ru" className="flex items-center gap-4 hover:text-white transition-colors">
                <Icon name="Mail" size={20} /> ndom39@mail.ru
              </a>
              <div className="flex items-center gap-4">
                <Icon name="MapPin" size={20} /> Калининград, ул. Сергеева 14, офис 328
              </div>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ваше имя" className="w-full bg-transparent border border-white/20 px-4 py-4 placeholder:text-white/40 focus:border-white outline-none transition-colors" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Телефон" className="w-full bg-transparent border border-white/20 px-4 py-4 placeholder:text-white/40 focus:border-white outline-none transition-colors" />
            <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Комментарий" rows={4} className="w-full bg-transparent border border-white/20 px-4 py-4 placeholder:text-white/40 focus:border-white outline-none transition-colors resize-none" />
            <Button type="submit" disabled={sending} size="lg" className="w-full rounded-none bg-white text-black hover:bg-white/90">{sending ? 'Отправка…' : 'Отправить заявку'}</Button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-display text-xl tracking-mega text-foreground">НОВЫЙ ДОМ</span>
          <span>© 2026 Модульные дома под ключ</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;