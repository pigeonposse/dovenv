import { UserConfig } from 'vitepress'

import { RequiredDocsConfig } from '../config/types'

export const setHeadCss = ( conf: RequiredDocsConfig ): NonNullable<UserConfig['head']> => {

	const setID = ( id: string ) => conf.name + '-' + id + '-css'

	const headConfig: NonNullable<UserConfig['head']> = []

	if ( conf.llms === false ) headConfig.push( [
		'style',
		{
			type : 'text/css',
			id   : setID( 'llmstxt' ),
		},
		`.llmstxt-section { display: none; }`,
	] )

	if ( conf.css ) headConfig.push( [
		'style',
		{
			type : 'text/css',
			id   : setID( 'user' ),
		},
		conf.css,
	] )

	headConfig.push( [
		'style',
		{
			type : 'text/css',
			id   : setID( 'theme' ),
		},
		`
      :root {
        --pp-brand-1: ${conf.styles.color.primary};
        --pp-brand-2: ${conf.styles.color.secondary};
        --pp-brand-3: ${conf.styles.color.terciary};
        --pp-brand-4: ${conf.styles.color.fourth};
        --vp-c-text-1: ${conf.styles.color.light.text};
        --vp-c-text-2: ${conf.styles.color.light.text2};
        --vp-c-text-3:${conf.styles.color.light.text3};
        --vp-c-bg: ${conf.styles.color.light.bg};
        --vp-c-bg-alt: ${conf.styles.color.light.bgAlt};
        --vp-c-bg-elv: ${conf.styles.color.light.bgSoft};
        --vp-c-bg-soft: ${conf.styles.color.light.bgSoft};
        --vp-c-bg-opacity: ${conf.styles.color.light.bgOpacity};
        --vp-c-divider: ${conf.styles.color.light.divider};
        --pp-brand-shadow: ${conf.styles.color.light.shadow};
        --pp-radius: ${conf.styles.radius};
        --vp-c-brand-1: var(--pp-brand-2);
        --vp-c-brand-2: var(--pp-brand-1);
        --vp-c-brand-3: var(--pp-brand-3);
        --vp-sidebar-bg-color: var(--vp-c-bg);
        --vp-home-hero-name-color: transparent;
        --vp-home-hero-name-background: -webkit-linear-gradient(150deg, var(--pp-brand-2), var(--pp-brand-4), var(--pp-brand-3), var(--pp-brand-1));
        --vp-home-hero-image-background-image: linear-gradient(150deg, var(--pp-brand-2), var(--pp-brand-4), var(--pp-brand-3), var(--pp-brand-1));
        --vp-home-hero-image-filter: blur(56px);
      }
      .dark {
        --vp-c-text-1: ${conf.styles.color.dark.text};
        --vp-c-text-2: ${conf.styles.color.dark.text2};
        --vp-c-text-3:${conf.styles.color.dark.text3};
        --vp-c-bg: ${conf.styles.color.dark.bg};
        --vp-c-bg-alt: ${conf.styles.color.dark.bgAlt};
        --vp-c-bg-elv: ${conf.styles.color.dark.bgSoft};
        --vp-c-bg-soft: ${conf.styles.color.dark.bgSoft};
        --vp-c-bg-opacity: ${conf.styles.color.dark.bgOpacity};
        --vp-c-divider: ${conf.styles.color.dark.divider};
        --pp-brand-shadow: ${conf.styles.color.dark.shadow};
      }
    `,
	] )

	return headConfig

}
