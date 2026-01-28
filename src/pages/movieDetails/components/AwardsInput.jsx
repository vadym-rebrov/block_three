import React from 'react';
import { useIntl } from 'react-intl';
import TextField from 'components/TextField';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import IconClose from 'components/icons/Close';
import Typography from 'components/Typography';

function AwardsInput({ awards = [], onChange }) {
    const intl = useIntl();

    const handleAwardChange = (index, value) => {
        const newAwards = [...awards];
        newAwards[index] = value;
        onChange(newAwards);
    };

    const handleAddAward = () => {
        onChange([...awards, '']);
    };

    const handleRemoveAward = (index) => {
        const newAwards = awards.filter((_, i) => i !== index);
        onChange(newAwards);
    };

    return (
        <div>
            <Typography variant="subTitle" style={{ marginBottom: 10 }}>{intl.formatMessage({ id: 'labelAwards' })}</Typography>
            {awards.map((award, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                    <TextField
                        value={award}
                        onChange={e => handleAwardChange(index, e.target.value)}
                        placeholder={intl.formatMessage({ id: 'phAward' })}
                    />
                    <IconButton onClick={() => handleRemoveAward(index)}>
                        <IconClose size={20} />
                    </IconButton>
                </div>
            ))}
            <Button variant="secondary" onClick={handleAddAward} >
                {intl.formatMessage({ id: 'btnAddAward' })}
            </Button>
        </div>
    );
}

export default AwardsInput;