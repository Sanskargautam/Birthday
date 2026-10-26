import { useSectionSpy } from '../hooks/useSectionSpy';

const links = [
  { href: '#top', id: 'top', label: 'Start' },
  { href: '#about', id: 'about', label: 'You' },
  { href: '#cards', id: 'cards', label: 'Letter' },
  { href: '#moments', id: 'moments', label: 'Pics' },
  { href: '#gift', id: 'gift', label: 'Gifts' },
];

export function Nav() {
  const active = useSectionSpy();

  return (
    <header className="site-top">
      <div className="site-top__inner">
        <a className="site-top__brand" href="#top">
          Sanskar <span aria-hidden>♥</span> Ruu
        </a>
        <p className="site-top__date">Happy 27th · 27 October</p>
        <nav className="site-top__nav" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.id ? 'site-top__nav-link--active' : undefined}
              aria-current={active === l.id ? 'location' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
