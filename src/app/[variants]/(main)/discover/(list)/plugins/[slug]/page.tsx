import urlJoin from 'url-join';

import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { DiscoverService } from '@/server/services/discover';
import { translation } from '@/server/translation';
import { DiscoverPageProps, PluginCategory } from '@/types/discover';
import { RouteVariants } from '@/utils/server/routeVariants';

import List from '../features/List';

export const generateMetadata = async (props: DiscoverPageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { t, locale } = await translation('metadata', searchParams?.hl);
  const { t: td } = await translation('discover', searchParams?.hl);

  return metadataModule.generate({
    alternate: true,
    description: t('discover.plugins.description'),
    locale,
    title: [td(`category.plugin.${params.slug}`), t('discover.plugins.title')].join(' · '),
    url: urlJoin('/discover/plugins', params.slug),
  });
};

const Page = async (props: DiscoverPageProps<PluginCategory>) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { t, locale } = await translation('metadata', searchParams?.hl);
  const { t: td } = await translation('discover', searchParams?.hl);
  const mobile = await RouteVariants.getIsMobile(props);

  const discoverService = new DiscoverService();
  const items = await discoverService.getPluginCategory(locale, params.slug);

  const ld = ldModule.generate({
    description: t('discover.plugins.description'),
    title: [td(`category.plugin.${params.slug}`), t('discover.plugins.title')].join(' · '),
    url: urlJoin('/discover/plugins', params.slug),
    webpage: {
      enable: true,
      search: '/discover/search',
    },
  });

  return (
    <>
      <StructuredData ld={ld} />
      <List category={params.slug} items={items} mobile={mobile} />
    </>
  );
};

export const generateStaticParams = async () => {
  const cates = Object.values(PluginCategory);
  return cates.map((cate) => ({
    slug: cate,
  }));
};

Page.DisplayName = 'DiscoverToolsCategory';

export default Page;
