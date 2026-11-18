# Aspire Catering & Events Services website

This static HTML, CSS and JavaScript website uses a first-person company voice and the approved luxury-event visual style. Its pages are Home, About Us, Services & Events, Gallery, Contact, Privacy (Draft) and Terms (Draft). The former standalone Company Profile page has been consolidated into About Us.

## Run locally

From this directory, start a static HTTP server:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Then open the local Preview on port 3000.

## Assets and typography

The supplied logo and photographs are sorted into `images/brand/` (chef-cap + Aspire mark), `images/food/` (food and catering) and `images/events/` (event and equipment setups). Public captions and alt text describe the pictures without identifying the supplied source material. Certificates and owner personal information are not included. Cormorant Garamond and Jost are self-hosted WOFF2 fonts in `fonts/`, with each family's SIL Open Font License beside its font.

## Social links and WhatsApp

WhatsApp is linked to `+254729845842`; the floating button is an icon-only green circle with an accessible label. Facebook, Twitter and Instagram appear as inactive footer slots until we add their real public URLs. Add them at the top of `script.js` in `SOCIAL_LINKS`, using full `https://` URLs.

## Gallery and review snapshot

The Gallery retains its food/event categories, filters and lightbox. On desktop, page scroll advances the carousel horizontally; on phones, photos flow vertically and the active image grows into focus. Reduced-motion preferences switch the gallery to a non-animated scrollable layout.

The Home page displays the 4.7/5 rating from 9 reviews observed on a Google Maps result matching our business name, Meru locality and phone number on 6 November 2026. Its link opens a Maps search for our name and number rather than embedding review text; visitors can confirm the exact listing and read current reviews. This is a dated snapshot, not a live feed. Recheck before publishing.

## Privacy and terms

`privacy.html` and `terms.html` are clearly marked drafts and set `noindex,nofollow` until we review them. The Privacy draft flags analytics as enabled in the current project configuration and identifies business-specific data-handling details that still need confirmation. The Terms draft deliberately does not invent booking, deposit, payment, cancellation or equipment-loss policies. Obtain appropriate business/legal review before treating either draft as official.

The website has no backend, sign-in, enquiry form, online booking or checkout. Each page includes initial, crawlable HTML and its own title and description. Absolute canonical and social-preview URLs have not been guessed because no public site domain has been supplied. The current Home hero is deliberately preserved for this iteration; a future replacement background should use an image that is not from the supplied profile.
