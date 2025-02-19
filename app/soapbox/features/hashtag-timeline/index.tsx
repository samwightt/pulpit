import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { connectHashtagStream } from 'soapbox/actions/streaming';
import { expandHashtagTimeline, clearTimeline } from 'soapbox/actions/timelines';
import ColumnHeader from 'soapbox/components/column_header';
import { Column } from 'soapbox/components/ui';
import Timeline from 'soapbox/features/ui/components/timeline';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import type { Tag as TagEntity } from 'soapbox/types/entities';

type Mode = 'any' | 'all' | 'none';

type Tag = { value: string };
type Tags = { [k in Mode]: Tag[] };

interface IHashtagTimeline {
  params?: {
    id?: string,
    tags?: Tags,
  },
}

export const HashtagTimeline: React.FC<IHashtagTimeline> = ({ params }) => {
  const id = params?.id || '';
  const tags = params?.tags || { any: [], all: [], none: [] };

  const dispatch = useAppDispatch();
  const hasUnread = useAppSelector<boolean>(state => (state.timelines.getIn([`hashtag:${id}`, 'unread']) as number) > 0);
  const disconnects = useRef<(() => void)[]>([]);

  // Mastodon supports displaying results from multiple hashtags.
  // https://github.com/mastodon/mastodon/issues/6359
  const title = () => {
    const title: React.ReactNode[] = [`#${id}`];

    if (additionalFor('any')) {
      title.push(' ', <FormattedMessage key='any' id='hashtag.column_header.tag_mode.any' values={{ additional: additionalFor('any') }} defaultMessage='or {additional}' />);
    }

    if (additionalFor('all')) {
      title.push(' ', <FormattedMessage key='all' id='hashtag.column_header.tag_mode.all' values={{ additional: additionalFor('all') }} defaultMessage='and {additional}' />);
    }

    if (additionalFor('none')) {
      title.push(' ', <FormattedMessage key='none' id='hashtag.column_header.tag_mode.none' values={{ additional: additionalFor('none') }} defaultMessage='without {additional}' />);
    }

    return title;
  };

  const additionalFor = (mode: Mode) => {
    if (tags && (tags[mode] || []).length > 0) {
      return tags[mode].map(tag => tag.value).join('/');
    } else {
      return '';
    }
  };

  const subscribe = () => {
    const any  = tags.any.map(tag => tag.value);
    const all  = tags.all.map(tag => tag.value);
    const none = tags.none.map(tag => tag.value);

    [id, ...any].map(tag => {
      disconnects.current.push(dispatch(connectHashtagStream(id, tag, status => {
        const tags = status.tags.map((tag: TagEntity) => tag.name);

        return all.filter(tag => tags.includes(tag)).length === all.length &&
               none.filter(tag => tags.includes(tag)).length === 0;
      })));
    });
  };

  const unsubscribe = () => {
    disconnects.current.map(disconnect => disconnect());
    disconnects.current = [];
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandHashtagTimeline(id, { maxId, tags }));
  };

  useEffect(() => {
    subscribe();
    dispatch(expandHashtagTimeline(id, { tags }));

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    unsubscribe();
    subscribe();
    dispatch(clearTimeline(`hashtag:${id}`));
    dispatch(expandHashtagTimeline(id, { tags }));
  }, [id, tags]);

  return (
    <Column label={`#${id}`} transparent withHeader={false}>
      <ColumnHeader active={hasUnread} title={title()} />
      <Timeline
        scrollKey='hashtag_timeline'
        timelineId={`hashtag:${id}`}
        onLoadMore={handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
        divideType='space'
      />
    </Column>
  );
};

export default HashtagTimeline;