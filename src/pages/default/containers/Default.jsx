import { useIntl } from 'react-intl';
import React from 'react';
import Typography from 'components/Typography';

function Default() {
  const { formatMessage } = useIntl();

  return (
    <Typography>
      {formatMessage({ id: 'title' })}
      <img src={'/logo512.png'}/>
    </Typography>
  );
}

export default Default;
