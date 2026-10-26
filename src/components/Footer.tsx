import { fromAuthor, friendProfile, sliderPhotos } from '../content/messages';

export function Footer() {
  const cover = sliderPhotos[1]?.src ?? sliderPhotos[0].src;

  return (
    <footer className="site-footer">
      <a
        className="site-footer__ig"
        href={friendProfile.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ruu on Instagram`}
      >
        <img className="ig-cta__avatar" src={cover} alt="" width={88} height={88} loading="lazy" decoding="async" />
      </a>
      <p>Made with love by {fromAuthor.name} for Ruu</p>
    </footer>
  );
}
