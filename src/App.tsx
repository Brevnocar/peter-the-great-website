import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Menu,
  X,
  ChevronDown,
  ArrowUp,
  Crown,
  Sword,
  Ship,
  BookOpen,
  Building2,
  Factory,
  Church,
  Compass,
  MapPin,
  Calendar,
  Crown as CrownIcon,
  History,
  Check,
  Heart,
  Users,
  TrendingUp,
  Award,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react'

// Image component with fallback handling
const HistoricalImage = ({ 
  src, 
  alt, 
  className = '', 
  caption,
  width,
  height,
  loading = 'lazy',
  fit = 'contain',
  position = 'center',
  aspectRatio = '4/3',
  background = true
}: { 
  src: string
  alt: string
  className?: string
  caption?: string
  width?: string
  height?: string
  loading?: 'lazy' | 'eager'
  fit?: 'contain' | 'cover'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
  aspectRatio?: string
  background?: boolean
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Prepend base URL for GitHub Pages deployment
  const baseUrl = import.meta.env.BASE_URL || '/'
  const imageSrc = src.startsWith('/') ? `${baseUrl}${src.slice(1)}` : src
  
  const containerStyle: React.CSSProperties = {
    width,
    height,
    aspectRatio,
  }
  
  const imageStyle: React.CSSProperties = {
    objectFit: fit,
    objectPosition: position,
  }

  if (hasError) {
    return (
      <div className={`historical-frame relative overflow-hidden ${className}`} style={containerStyle}>
        {background && fit === 'contain' && (
          <div className="absolute inset-0 bg-slate-950" />
        )}
        {caption && (
          <div className="image-caption absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent">
            <p className="text-silver-500 text-xs italic flex items-center justify-center gap-1">
              <ImageIcon className="w-3 h-3" /> {caption}
            </p>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={`historical-frame relative overflow-hidden ${className}`} style={containerStyle}>
      {background && fit === 'contain' && (
        <div className="absolute inset-0 bg-slate-950 pointer-events-none" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        crossOrigin="anonymous"
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        style={imageStyle}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <div className="w-8 h-8 border-2 border-silver-600 border-t-silver-300 rounded-full animate-spin" />
        </div>
      )}
      {caption && (
        <div className="image-caption absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent">
          <p className="text-silver-400 text-xs italic flex items-center justify-center gap-1">
            <ImageIcon className="w-3 h-3" /> {caption}
          </p>
        </div>
      )}
    </div>
  )
}

// Types
interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'hero', label: 'Главная' },
  { id: 'timeline', label: 'Хронология' },
  { id: 'childhood', label: 'Детство' },
  { id: 'embassy', label: 'Великое посольство' },
  { id: 'reforms', label: 'Реформы' },
  { id: 'war', label: 'Северная война' },
  { id: 'petersburg', label: 'Санкт-Петербург' },
  { id: 'economy', label: 'Экономика' },
  { id: 'culture', label: 'Культура и наука' },
  { id: 'everyday', label: 'Повседневная жизнь' },
  { id: 'church', label: 'Церковная реформа' },
  { id: 'conclusion', label: 'Итоги' },
]

// Timeline data
const timelineEvents = [
  { year: '1672', title: 'Рождение Петра I', description: 'Родился в Москве 9 июня (30 мая по старому стилю) в царской семье Алексея Михайловича и Натальи Кирилловны Нарышкиной.', icon: Crown, image: undefined },
  { year: '1682', title: 'Возведение на престол', description: 'Провозглашён царем совместно с братом Иваном V при регентстве царевны Софьи.', icon: CrownIcon, image: undefined },
  { year: '1697–1698', title: 'Великое посольство', description: 'Поездка в Европу для изучения технологий, кораблестроения и укрепления союзов.', icon: Ship, image: '/images/peter-holland.jpg' },
  { year: '1700–1721', title: 'Северная война', description: 'Война со Швецией за выход к Балтийскому морю. Поражение под Нарвой, Победа при Пόλтаве, Ништадтский мир.', icon: Sword, image: undefined },
  { year: '1703', title: 'Основание Санкт-Петербурга', description: 'Заложена крепость на Заячьем острове. В 1712 году — новая столица России.', icon: Building2, image: '/images/peter-stpetersburg-map-box.jpg' },
  { year: '1709', title: 'Полтавская битва', description: 'Решающая победа над шведским королём Карлом XII. Переломный момент войны.', icon: Award, image: undefined },
  { year: '1721', title: 'Проглашение Империи', description: 'Сенат и Синод провозглашают Петра императором. Россия становится империей.', icon: CrownIcon, image: '/images/peter-portrait-benner.jpg' },
  { year: '1725', title: 'Смерть Петра I', description: 'Умер 8 февраля (28 января по старому) в Санкт-Петербурге. Оставил после себя преобразованную страну.', icon: History, image: '/images/peter-portrait-luciani.jpg' },
]

// Type definitions
interface ContentSectionItem {
  title: string
  desc: string
  image?: string
}

interface ContentSectionBattle {
  name: string
  result: string
  color: string
  image?: string
}

interface ContentSectionData {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  content?: string[]
  items?: ContentSectionItem[]
  battles?: ContentSectionBattle[]
  heroImage?: string
  heroImageAspectRatio?: string
}

// Content sections data with images
const contentSections: ContentSectionData[] = [
  {
    id: 'childhood',
    title: 'Детство и начало правления',
    subtitle: '1672–1689',
    icon: Crown,
    heroImage: undefined,
    content: [
      'Пётр Алексеевич родился 9 июня 1672 года в Москве. Отец — царь Алексей Михайлович, мать — Наталья Кирилловна Нарышкина. Был младшим сыном.',
      'После смерти отца в 1676 году престол перешёл к старшему брату Фёдору. При его смерти в 1682 году возник спор о наследовании.',
      'В итоге царями провозгласили двух братьев — Ивана V и Петра I. Регентшей стала царевна Софья, фактически управлявшая страной до 1689 года.',
      'Юный Пётр провёл время в подмосковных сёлах Преображенском и Семёновском, где интересовался военным делом, техникой и ремёслами.',
    ],
  },
  {
    id: 'youth',
    title: 'Юность и формирование интересов',
    subtitle: '1689–1697',
    icon: Compass,
    heroImage: '/images/peter-portrait-luciani.jpg',
    heroImageAspectRatio: '3/4',
    content: [
      'С 1689 года Пётр начал самостоятельное правление. Особое внимание уделял военным играм, из которых выросли потешные полки — основа будущей гвардии.',
      'Знакомство с иностранцами в Немецкой слободе и посещение европейских поселений в Москве сформировали стремление к современзации.',
      'Пётр хотел не просто заимствовать технологии, а понять принципы устройства армии, флота, производства и государственного управления.',
      'Уже тогда зародилась идея создания регулярного флота и переориентации внешней политики на Балтийское море.',
    ],
  },
  {
    id: 'embassy',
    title: 'Великое посольство (1697–1698)',
    subtitle: 'Путь к преобразованиям',
    icon: Ship,
    heroImage: '/images/peter-holland.jpg',
    heroImageAspectRatio: '4/3',
    content: [
      'Официальная цель — укрепление союза против Османской империи, но главная задача Петра — изучение европейского опыта.',
      'Пётр посещал верфи в Голландии и Англии, работал плотником, изучал кораблестроение, артиллерию, медицину и анатомию.',
      'Пригласил в Россию сотни иностранных специалистов: корабелов, инженеров, врачей, артистов, мастеров ремёсел.',
      'Поездка убедила царя в необходимости коренной перестройки государства по европейскому образцу.',
    ],
  },
  {
    id: 'reforms',
    title: 'Государственные реформы',
    subtitle: '1708–1722',
    icon: Building2,
    heroImage: '/images/peter-portrait-benner.jpg',
    heroImageAspectRatio: '191/256',
    items: [
      { title: 'Губернская реформа (1708)', desc: 'Страна разделена на 8 (позже 50) губерний для лучшего управления огромными территориями.', image: undefined },
      { title: 'Сенат (1711)', desc: 'Высший орган власти, управлявший страной в отсутствие царя и контролирующий работу учреждений.', image: undefined },
      { title: 'Коллегии (1717–1721)', desc: 'Специализированные министерства: иностранных дел, военной, адмиралтейства, казенной, манифактурной и др.', image: undefined },
      { title: 'Табель о рангах (1722)', desc: 'Система 14 чинов для службу, позволяющая дворянам продвигаться по личным заслугам, а не по происхождению.', image: undefined },
      { title: 'Духовный регламент (1721)', desc: 'Создание Святейшего Синода вместо патриархатуры — церковь под контроль государства.', image: undefined },
    ],
  },
  {
    id: 'war',
    title: 'Северная война (1700–1721)',
    subtitle: 'Борьба за выход к Балтийскому морю',
    icon: Sword,
    heroImage: undefined,
    content: [
      'Главное внешнеполитическое событие правления. Россия искала выход к морю для торговли и международных связей.',
      '1700 — катастрофическое поражение под Нарвой. Пётр ускорил реформы: укреплял армию, артиллерию, снабжение, металлургию.',
      '1709 — Полтавская битва: решающая победа над Карлом XII. Перелом войны в пользу России.',
      '1721 — Ништадтский мир: Россия получила прибалтийские территории, укрепилась на море, получила международное признание.',
    ],
    battles: [
      { name: 'Нарва (1700)', result: 'Поражение', color: 'bg-red-500/50', image: undefined },
      { name: 'Эрихсдорф (1701)', result: 'Победа', color: 'bg-green-500/50', image: undefined },
      { name: 'Полтава (1709)', result: 'Решающая победа', color: 'bg-amber-500/50', image: undefined },
      { name: 'Полная (1709)', result: 'Капитуляция шведского корпуса', color: 'bg-green-500/50', image: undefined },
      { name: 'Гангут (1714)', result: 'Первая крупная морская победа', color: 'bg-blue-500/50', image: undefined },
      { name: 'Гренгам (1720)', result: 'Победа русского галерного флота', color: 'bg-green-500/50', image: undefined },
    ],
  },
  {
    id: 'petersburg',
    title: 'Санкт-Петербург — окно в Европу',
    subtitle: '1703 — новая столица',
    icon: MapPin,
    heroImage: '/images/peter-stpetersburg-map-box.jpg',
    heroImageAspectRatio: '4/3',
    content: [
      '16 (27) мая 1703 года на Заячьем острове в устье Невы заложена Петропавловская крепость — начало города.',
      'Стратегическое значение: укрепление на Балтике, база для флота, порт для торговли с Европой.',
      'Строительство в тяжёлых условиях: болотистая местность, нехватка материалов, эпидемии. Привлекались десятки тысяч рабочих.',
      '1712 — официальный перенос столицы из Москвы. Город проектировался как регулярный, с проспектами, каналами, архитектурными ансамблями.',
      'К 1725 году — крупный центр: Адмиралтейство, Дворцовая площадь, Невский проспект, летние сады, Кунсткамера, Академия наук.',
    ],
  },
  {
    id: 'economy',
    title: 'Экономика и промышленность',
    subtitle: 'Заводы, мануфактуры, торговля',
    icon: Factory,
    heroImage: undefined,
    content: [
      'Войны и флот требовали металла, оружия, парусины, канатов. Активное развитие горного дела и металлургии, особенно на Урале.',
      'Построены десятки заводов: казенные (государственные) и частные. Россия в 1-е место в мире по выплавке чугуна (1720-е).',
      'Мануфактуры: суконные, шёлковые, бумажные, стекольные. Привлекались мастера из Европы, обучали русских рабочих.',
      'Развитие внутренней торговли: ярмарки, таможенные пошлины для защиты отечественных товаров, создание товарных путей.',
      'Тяжёлая цена: рекрутские наборы, подушная подать, принудительный труд на заводах, рост крепостного права.',
    ],
  },
  {
    id: 'culture',
    title: 'Образование, наука и культура',
    subtitle: 'Новые горизонты',
    icon: BookOpen,
    heroImage: undefined,
    items: [
      { title: 'Специальные школы', desc: 'Навигационская (1701), артиллерийская, инженерная, медицинская, горная. Обучение математике, навигации, артиллерии, врачеванию.', image: undefined },
      { title: 'Газета «Ведомости» (1703)', desc: 'Первая русская печатная газета. Информировала о войнах, реформах, событиях в Европе. Петр сам редактировал номера.', image: undefined },
      { title: 'Кунсткамера (1714)', desc: 'Первый публичный музей в России. Собрание anatomical specimens, редких предметов, библиотека. Основана по указу Петра.', image: undefined },
      { title: 'Академия наук (1724)', desc: 'Указ об учреждении. Открыта в 1725 году после смерти Петра. Объединила науку, образование, издательство. Приглашены учёные из Европы (Эйлер, Бернулли и др.).', image: undefined },
      { title: 'Календарная реформа (1700)', desc: 'Новый год перенесён на 1 января. Летоисчисление от Рождества Христова (не от Сотворения мира). Приближение к европейскому календарю.', image: undefined },
      { title: 'Ассамблеи и быт', desc: 'Светские собрания по европейскому образцу. Танцы, разговоры, игры. Новые правила одежды для дворян — немецкие костюмы вместо долгих одеяний.', image: '/images/peter-assembly.jpg' },
    ],
  },
  {
    id: 'everyday',
    title: 'Изменения в повседневной жизни',
    subtitle: 'Традиции и новации',
    icon: Users,
    heroImage: '/images/peter-assembly.jpg',
    heroImageAspectRatio: '4/3',
    content: [
      'Пётр вводил европейские манеры: бритье бород, западная одежда, табак, кофе, карты, танцы.',
      'Ассамблеи — обязательные светные вечера для дворян. Женщины выходили в свет, что было необычно для московской традиции.',
      'Календарная реформа: с 1700 года отсчёт лет от Рождества Христова, новый год 1 января. Внедрение юлианского календаря.',
      'Приказ о ношении европейского платья (1700) для дворян и горожан. Бороды подлежали соскоблению за плату (бородовая пошлина).',
      'Общество восприняло реформы двояко: часть видела прогресс, другая — нарушение святых предков традиций. Раскол крепчал.',
    ],
  },
  {
    id: 'church',
    title: 'Церковная реформа',
    subtitle: 'Подчинение церкви государству',
    icon: Church,
    heroImage: undefined,
    content: [
      'После смерти патриарха Адриана (1700) новый патриарх не избирался. Петром управлял патриарший لوكом (ранг ниже).',
      '1721 — учреждён Святейший Правительствующий Синод. Коллегиальный орган, управлявший церковью вместо патриарха.',
      'Обер-прокурора — «глаз царя» в Синоде, следил за выполнением государственных интересов.',
      'Церковь лишена самостоятельности в управлении, имуществе, суде. Духовенство стало государственными служащими.',
      'Реформа соответствовала курсу на абсолютизм: концентрация всей власти в руках монарха.',
    ],
  },
]

// Key dates for conclusion
const keyDates = [
  { year: '1672', event: 'Рождение Петра I в Москве' },
  { year: '1682', event: 'Провозглашение царем (совместно с Иваном V)' },
  { year: '1697–1698', event: 'Великое посольство в Европу' },
  { year: '1700–1721', event: 'Северная война со Швецией' },
  { year: '1703', event: 'Основание Санкт-Петербурга' },
  { year: '1709', event: 'Полтавская битва — переломная vitória' },
  { year: '1721', event: 'Ништадтский мир; Россия — Империя, Петр — Император' },
  { year: '1725', event: 'Смерть Петра I в Санкт-Петербурге' },
]

// Components
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  
  return (
    <motion.div
      style={{ width }}
      className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-silver-600 via-silver-400 to-silver-600 z-50 transition-all duration-300"
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}

const Header = ({ activeSection, setActiveSection, scrollToSection }: { 
  activeSection: string
  setActiveSection: (id: string) => void
  scrollToSection: (id: string) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleNavClick = (id: string) => {
    scrollToSection(id)
    setActiveSection(id)
    setMobileMenuOpen(false)
  }
  
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)] border-b border-silver-800' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Главная навигация">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick('hero')}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center border border-silver-700">
              <Crown className="w-6 h-6 text-silver-100" />
            </div>
            <span className="font-serif text-xl lg:text-2xl font-bold text-silver-100 hidden sm:block tracking-tight whitespace-nowrap">
              Петр I
            </span>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-1">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(section.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-silver-800/50 text-silver-100 shadow-lg border border-silver-700'
                    : 'text-silver-400 hover:text-silver-100 hover:bg-slate-800/50'
                }`}
              >
                {section.label}
              </motion.button>
            ))}
          </div>
          
          <div className="lg:hidden flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-silver-400 hover:bg-slate-800/50 hover:text-silver-100"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
        
        <motion.div
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          className="lg:hidden overflow-hidden bg-slate-950/95 backdrop-blur-xl border-t border-silver-800 py-4"
        >
          <div className="flex flex-col gap-2 px-4">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 8 }}
                onClick={() => handleNavClick(section.id)}
                className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-silver-800/50 text-silver-100 border border-silver-700'
                    : 'text-silver-400 hover:bg-slate-800/50 hover:text-silver-100'
                }`}
              >
                {section.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden section-bg">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          {/* Portrait - left side on desktop, top on mobile */}
          <div className="lg:w-1/2 flex-shrink-0 w-full">
            <HistoricalImage
              src="/images/peter-portrait-mardefeld.jpg"
              alt="Пётр Великий с чернокожим пажом, Густав фон Мардефельд, ок. 1720"
              className="rounded-2xl w-full"
              loading="eager"
              fit="contain"
              position="center"
              aspectRatio="7/8"
              background={false}
              caption="Пётр Великий с чернокожим пажом · Густав фон Мардефельд, ок. 1720 · Victoria and Albert Museum (V&A), Лондон · Инв. 605-1882"
            />
          </div>
          
          {/* Content - right side on desktop, bottom on mobile */}
          <div className="lg:w-1/2 w-full text-center lg:text-left min-w-0">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-silver-700 text-silver-300 text-sm font-medium mb-8"
            >
              <Crown className="w-4 h-4 text-silver-400" />
              <span>Реферат ученика 8 класса · Демидов</span>
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight leading-tight mb-6"
            >
              <span className="text-silver-100">Пётр I</span>
              <br />
              <span className="gradient-text">Первый русский император</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl sm:text-2xl text-silver-400 max-w-xl mb-10 leading-relaxed font-light"
            >
              Трансформация России: от царства к империи за одно правление
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#timeline"
                className="btn-primary group"
              >
                <span className="flex items-center gap-2">
                  Изучить хронологию
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#childhood"
                className="btn-secondary"
              >
                Начать с детства
              </motion.a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-silver-500"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-silver-400" />
                <span className="font-medium">1672–1725</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-silver-400" />
                <span className="font-medium">Император с 1721</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-silver-400" />
                <span className="font-medium">Основатель СПб</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div className="w-6 h-10 border-2 border-silver-600/50 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-silver-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

const Timeline = () => {
  return (
    <section id="timeline" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 section-bg-alt overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-silver-700 text-silver-300 text-sm font-medium mb-4">
            Хронология ключевых событий
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-silver-100 mb-4">
            Главные вехи правления
          </h2>
          <p className="text-lg text-silver-400 max-w-2xl mx-auto">
            От рождения в московской царской семье до провозглашения Российской империи
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Vertical line: left on mobile (16px), center on desktop */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 lg:-translate-x-1/2 timeline-connector"
            style={{ transformOrigin: 'top center' }}
          />
          
          <div className="space-y-6 lg:space-y-12">
            {timelineEvents.map((event, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative lg:flex lg:items-start"
                >
                  {/* Mobile: single column, line on left, card to the right */}
                  {/* Desktop: alternating - even on left, odd on right */}
                  <div className={`relative w-full lg:w-1/2 ${isEven ? 'lg:pr-8 lg:pl-0' : 'lg:pl-8 lg:pr-0'}`}>
                    {/* Marker on the line */}
                    <div className="absolute top-4 left-4 lg:left-1/2 lg:-translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-4 border-silver-500 z-10" />
                    {/* Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`glass-card p-6 rounded-2xl border shadow-xl ${isEven ? 'lg:border-r-4 lg:border-silver-500/50 lg:ml-4' : 'lg:border-l-4 lg:border-silver-500/50 lg:mr-4'} lg:w-[calc(50%-2rem)]`}
                      style={{ marginLeft: '1rem', marginRight: '1rem', maxWidth: 'calc(100% - 2rem)' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center">
                          <event.icon className="w-5 h-5 text-silver-100" />
                        </div>
                        <span className="text-2xl font-bold font-serif text-silver-200">{event.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-silver-100 mb-2">{event.title}</h3>
                      <p className="text-silver-400 leading-relaxed">{event.description}</p>
                    </motion.div>
                  </div>
                  {/* Spacer for alternating layout on desktop */}
                  <div className="lg:w-1/2 hidden" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
  
  const ContentSection = ({ section }: { section: ContentSectionData }) => {
  
  // Sections with cards (reforms, culture)
  if (section.items) {
    return (
      <section 
        id={section.id} 
        className={`relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 ${section.id === 'reforms' || section.id === 'culture' ? 'section-bg' : 'section-bg-alt'}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center border border-silver-700">
              <section.icon className="w-7 h-7 text-silver-100" />
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-silver-700 text-silver-300 text-sm font-medium mb-4">
              {section.subtitle}
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-silver-100 mb-4">
              {section.title}
            </h2>
          </motion.div>
          
          {/* Hero image for section */}
          {section.heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12 max-w-2xl mx-auto"
            >
              <HistoricalImage
                src={section.heroImage}
                alt={section.title}
                className="rounded-2xl"
                caption={`Историческое изображение к разделу «${section.title}»`}
                fit="contain"
                position="center"
                aspectRatio={section.heroImageAspectRatio || '3/4'}
              />
            </motion.div>
          )}
          
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 rounded-2xl group"
                >
                  {/* Card images removed per design requirements */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center mb-4 group-hover:from-silver-500 group-hover:to-silver-700 transition-colors">
                  <section.icon className="w-6 h-6 text-silver-100" />
                </div>
                <h3 className="text-lg font-bold text-silver-100 mb-2">{item.title}</h3>
                <p className="text-silver-400 leading-relaxed">{item.desc}</p>
              </motion.article>
            ))}
          </div>
          
          {section.battles && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold text-silver-100 text-center mb-8 flex items-center justify-center gap-3">
                <Sword className="w-6 h-6 text-silver-400" />
                Ключевые битвы Северной войны
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.battles.map((battle, i) => (
                  <motion.div
                    key={battle.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Battle images removed - no verified historical battle artworks available */}
                      <div>
                        <p className="font-semibold text-silver-100">{battle.name}</p>
                        <p className="text-sm text-silver-400">{battle.result}</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className={`w-3 h-3 rounded-full ${battle.color} border border-silver-600`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    )
  }
  
  // Sections with text content
  if (!section.content) return null
  
  return (
    <section 
      id={section.id} 
      className={`relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 ${['childhood', 'youth', 'embassy', 'war', 'petersburg', 'economy', 'everyday', 'church'].includes(section.id) ? 'section-bg-alt' : 'section-bg'}`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center border border-silver-700">
            <section.icon className="w-7 h-7 text-silver-100" />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-silver-700 text-silver-300 text-sm font-medium mb-4">
            {section.subtitle}
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-silver-100 text-center">
            {section.title}
          </h2>
        </motion.div>
        
        <div className="space-y-6">
          {section.content.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-lg text-silver-300 leading-relaxed glass-card p-6 rounded-xl"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

const Conclusion = () => {
  
  return (
    <section id="conclusion" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 section-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center border border-silver-700">
            <Crown className="w-7 h-7 text-silver-100" />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-silver-700 text-silver-300 text-sm font-medium mb-4">
            Заключение
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-silver-100 mb-4">
            Итоги и значение деятельности
          </h2>
          <p className="text-lg text-silver-400 max-w-2xl mx-auto">
            Оценка эпохи Петра I через призму достижений и цены перемен
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 mb-16"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-silver-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Достижения и позитивные изменения
            </h3>
            <div className="space-y-4">
              {[
                'Создана регулярная армия и военный флот — Россия стала морской державой',
                'Получен выход к Балтийскому морю, основан Санкт-Петербург — «окно в Европу»',
                'Проведены госреформы: губернии, Сенат, коллегии, Табель о рангах',
                'Развита промышленность: металлургия Урала, мануфактуры, судостроение',
                'Открыты специальные школы, газета «Ведомости», Кунсткамера, заложена Академия наук',
                'Россия провозглашена империей (1721), получен международный престиж',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 glass-card p-4 rounded-xl"
                >
                  <div className="w-6 h-6 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/30">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-silver-300">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-silver-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Цена преобразований и проблемы
            </h3>
            <div className="space-y-4">
              {[
                'Тяжёлые налоги: подушная подать, рекрутские наборы, новые пошлины',
                'Принудительный труд на заводах, строительстве СПб, каналов',
                'Укрепление крепостного права, прикрепление крестьян к заводам',
                'Трагические потери: тысячи жизней в войнах и на стройках',
                'Раскол в обществе: староверы против нововведений, сопротивление традициям',
                'Жёсткие методы: казни, пытки, преследование инакомыслящих (Царевич Алексей)',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 glass-card p-4 rounded-xl"
                >
                  <div className="w-6 h-6 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-red-500/30">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-silver-300">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Key dates */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-silver-100 text-center mb-8 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-silver-100" />
            </div>
            Основные даты
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyDates.map((date, i) => (
              <motion.div
                key={date.year}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-center p-5 rounded-xl bg-slate-900/50 border border-silver-800 hover:border-silver-600 hover:bg-slate-800/50 transition-all duration-300 group"
              >
                <p className="text-2xl font-bold font-serif text-silver-200 group-hover:text-silver-100 transition-colors">{date.year}</p>
                <p className="text-sm text-silver-500 mt-1">{date.event}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Quiz component - Interactive knowledge test
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: 'В каком году родился Пётр I?',
      options: ['1672', '1682', '1697', '1703'],
      correct: 0,
      explanation: 'Пётр I родился 9 июня (30 мая по старому стилю) 1672 года в Москве.'
    },
    {
      question: 'Какое событие положило начало Великому посольству?',
      options: ['Поездка Петра в Европу в 1697–1698 гг.', 'Полтавская битва', 'Основание Санкт-Петербурга', 'Проглашение Российской империи'],
      correct: 0,
      explanation: 'Великое посольство — поездка Петра I в Европу в 1697–1698 гг. для изучения технологий и укрепления союзов.'
    },
    {
      question: 'Какой битвой считается переломный момент Северной войны?',
      options: ['Битва при Нарве', 'Полтавская битва', 'Битва при Гангуте', 'Битва при Гренгаме'],
      correct: 1,
      explanation: 'Полтавская битва 1709 года стала решающей победой над шведским королём Карлом XII и переломным моментом войны.'
    },
    {
      question: 'Когда была заложена Петропавловская крепость — начало Санкт-Петербурга?',
      options: ['1700', '1703', '1712', '1721'],
      correct: 1,
      explanation: '16 (27) мая 1703 года на Заячьем острове в устье Невы заложена Петропавловская крепость.'
    },
    {
      question: 'Какой реформой Пётр I заменил патриархат на Святейший Синод?',
      options: ['Губернской реформой', 'Табелем о рангах', 'Духовным регламентом', 'Сенатской реформой'],
      correct: 2,
      explanation: 'Духовный регламент 1721 года создал Святейший Правительствующий Синод вместо патриархатуры.'
    },
    {
      question: 'Для чего был введён Табель о рангах в 1722 году?',
      options: ['Для разделения страны на губернии', 'Для создания регулярного флота', 'Чтобы дворяне продвигались по заслугам, а не по происхождению', 'Для подчинения церкви государству'],
      correct: 2,
      explanation: 'Табель о рангах установил систему 14 чинов, позволявшую дворянам продвигаться по личным заслугам.'
    },
    {
      question: 'Какое море стало доступным для России после Ништадтского мира 1721 года?',
      options: ['Чёрное море', 'Каспийское море', 'Балтийское море', 'Белое море'],
      correct: 2,
      explanation: 'По Ништадтскому миру 1721 года Россия получила выход к Балтийскому морю и прибалтийские территории.'
    },
    {
      question: 'Какое учебное заведение было основано первым у Петра I?',
      options: ['Академия наук', 'Навигационная школа', 'Кунсткамера', 'Медицинская школа'],
      correct: 1,
      explanation: 'Навигационная школа была открыта в 1701 году — первой специальной школой Петра I.'
    },
    {
      question: 'Как называлась первая русская печатная газета, основанная Петром I?',
      options: ['Правда', 'Ведомости', 'Сен-Августин', 'Российский вестник'],
      correct: 1,
      explanation: '«Ведомости» — первая русская печатная газета, начавшая выходить в 1703 году.'
    },
    {
      question: 'В каком году Россия была провозглашена Империей, а Пётр I — Императором?',
      options: ['1709', '1714', '1721', '1725'],
      correct: 2,
      explanation: 'В 1721 году, после Ништадтского мира, Сенат и Синод провозгласили Петра I Императором Всероссийским.'
    }
  ]

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setShowResults(true)
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setShowResults(false)
  }

  const getScore = () => {
    return questions.filter((q, i) => answers[i] === q.correct).length
  }

  const answeredCount = Object.keys(answers).length

  return (
    <section id="quiz" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 section-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center border border-silver-700">
            <Check className="w-7 h-7 text-silver-100" />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-silver-700 text-silver-300 text-sm font-medium mb-4">
            Интерактивный тест
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-silver-100 mb-4">
            Проверь свои знания о Петре I
          </h2>
          <p className="text-lg text-silver-400 max-w-2xl mx-auto">
            Ответь на 10 вопросов и узнай, насколько хорошо ты знаешь эпоху Петра Великого
          </p>
        </motion.div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-silver-400 mb-2">
                <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
                <span>{answeredCount} из {questions.length} отвечено</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-silver-500 to-silver-300 rounded-full"
                />
              </div>
            </div>

            {/* Question */}
            <div
              key={currentQuestion}
              className="glass-card p-6 lg:p-8 rounded-2xl animate-slide-in-right"
            >
              <h3 className="text-xl lg:text-2xl font-bold text-silver-100 mb-6 leading-relaxed">
                {questions[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(currentQuestion, i)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      answers[currentQuestion] === i
                        ? 'border-silver-400 bg-silver-800/30 text-silver-100'
                        : 'border-silver-700 hover:border-silver-600 hover:bg-slate-800/50 text-silver-300'
                    }`}
                    style={{ transform: answers[currentQuestion] === i ? 'scale(1)' : undefined }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Назад
              </motion.button>

              <div className="flex items-center gap-2 text-sm text-silver-500 overflow-x-auto scrollbar-hide pb-2">
                {questions.map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                      i === currentQuestion
                        ? 'bg-silver-600 text-silver-100'
                        : answers[i] !== undefined
                        ? 'bg-green-600/30 text-green-400 border border-green-500/30'
                        : 'bg-slate-800/50 text-silver-500 border border-silver-700'
                    }`}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                disabled={currentQuestion === questions.length - 1}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Далее
              </motion.button>
            </div>

            {/* Submit button */}
            {currentQuestion === questions.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full mt-8 btn-primary text-lg py-4"
              >
                {answeredCount < questions.length
                  ? `Подтвердить ответы (${questions.length - answeredCount} без ответа)`
                  : 'Подтвердить ответы'}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score summary */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="glass-card p-8 rounded-2xl text-center"
            >
              <div className="text-6xl font-bold font-serif text-silver-100 mb-2">
                {getScore()} из {questions.length}
              </div>
              <p className="text-silver-400 text-lg mb-4">
                {getScore() >= 7 ? 'Отличный результат!' : getScore() >= 5 ? 'Хороший результат!' : 'Стоит повторить материал.'}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <Check className="w-4 h-4" /> Правильно: {getScore()}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <X className="w-4 h-4" /> Ошибок: {questions.length - getScore()}
                </span>
                <span className="flex items-center gap-1 text-silver-400">
                  <HelpCircle className="w-4 h-4" /> Отвечено: {answeredCount}
                </span>
              </div>
            </motion.div>

            {/* Detailed results */}
            <div className="space-y-4">
              {questions.map((q, i) => {
                const userAnswer = answers[i]
                const isCorrect = userAnswer === q.correct
                const isAnswered = userAnswer !== undefined

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card p-6 rounded-xl ${isAnswered ? (isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500') : 'border-l-4 border-silver-700'}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect ? 'bg-green-500 text-white' : isAnswered ? 'bg-red-500 text-white' : 'bg-silver-700 text-silver-500'
                      }`}>
                        {i + 1}
                      </span>
                      <h4 className="text-lg font-semibold text-silver-100 flex-1">{q.question}</h4>
                    </div>
                    
                    <div className="ml-9 space-y-2">
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex} className={`flex items-center gap-2 text-sm p-2 rounded-lg transition-colors ${
                          optIndex === q.correct
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : optIndex === userAnswer && !isCorrect
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'text-silver-400'
                        }`}>
                          {optIndex === q.correct && <Check className="w-4 h-4 flex-shrink-0" />}
                          {optIndex === userAnswer && !isCorrect && <X className="w-4 h-4 flex-shrink-0" />}
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="ml-9 mt-3 pt-3 border-t border-silver-800">
                      <p className="text-sm text-silver-500">{q.explanation}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Restart button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestart}
              className="w-full mt-8 btn-secondary text-lg py-4"
            >
              Пройти ещё раз
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-silver-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-silver-600 to-silver-800 flex items-center justify-center border border-silver-700">
                <Crown className="w-6 h-6 text-silver-100" />
              </div>
              <span className="font-serif text-xl font-bold text-silver-100">Пётр I</span>
            </div>
            <p className="text-silver-500 leading-relaxed text-sm">
              Образовательный проект, основанный на реферате ученика 8 класса Демидова.
              Посвещён изучению эпохи Петра Великого и его преобразований.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-silver-100 mb-4">Разделы</h4>
            <nav aria-label="Навигация по футеру">
              <ul className="space-y-2">
                {sections.slice(0, 6).map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="hover:text-silver-300 transition-colors text-sm text-silver-500">
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div>
            <h4 className="font-semibold text-silver-100 mb-4">Остальные разделы</h4>
            <nav aria-label="Навигация по футеру">
              <ul className="space-y-2">
                {sections.slice(6).map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="hover:text-silver-300 transition-colors text-sm text-silver-500">
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="divider-silver mb-6" />
        
        <p className="text-silver-600 text-sm text-center">
          © 2026 Образовательный проект «Пётр I — Первый российский император»
        </p>
      </div>
    </footer>
  )
}

const ScrollToTop = () => {
  const { scrollY } = useScroll()
  const isVisible = useTransform(scrollY, [0, 300], [0, 1])
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <motion.button
      style={{ opacity: isVisible }}
      whileHover={{ scale: 1.1, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-silver-100 shadow-xl border border-silver-700 flex items-center justify-center hover:from-slate-700 hover:to-slate-800 hover:border-silver-600 transition-all duration-300"
      aria-label="Прокрутить вверх"
    >
      <ArrowUp className="w-6 h-6" />
    </motion.button>
  )
}

// Main App
function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
  // Initialize refs
  sections.forEach(s => {
    sectionRefs.current[s.id] = null
  })
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80 // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
  
  // Update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    )
    
    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <>
      <ScrollProgress />
      
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        scrollToSection={scrollToSection}
      />
      
      <main className="pt-16 lg:pt-20">
        <Hero />
        <Timeline />
        {contentSections.map((section) => (
          <ContentSection key={section.id} section={section} />
        ))}
        <Conclusion />
        <Quiz />
      </main>
      
      <Footer />
      
      <ScrollToTop />
    </>
  )
}

export default App