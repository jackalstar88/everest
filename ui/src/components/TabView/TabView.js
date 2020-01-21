/** @jsx jsx */
import PropTypes from 'prop-types'
import { Styled, jsx, Box } from 'theme-ui'
import { Grid } from '@theme-ui/components'

import Field from '../Field'
import Button from '../Button'

const TabView = ({
  description,
  fieldType,
  charsCount,
  title,
  placeholder,
  heading,
  value,
  setValue,
  text,
  icon,
  handleClick,
  showFilters,
  items,
}) => {
  return (
    <Grid
      sx={{
        backgroundColor: 'secondary',
        position: 'absolute',
        zIndex: 10,
        left: 0,
        width: '100%',
        marginTop: '-1px',
      }}
    >
      <Grid
        sx={{
          gridTemplateColumns: ['1fr', '312px 1fr'],
          position: 'relative',
          maxWidth: '1260px',
          padding: '0 20px',
          margin: '0 auto',
          width: '100%',
          my: 7,
        }}
        gap={[1, 8]}
      >
        <Box>
          <Styled.h1 sx={{ color: 'white', mb: 3 }}>{heading}</Styled.h1>
          <p sx={{ variant: 'text.field' }}>{description}</p>
          <p sx={{ variant: 'text.field', mt: 5 }}>Fee</p>
          <p sx={{ variant: 'text.displayBig', color: 'white' }}>100 DAI</p>
        </Box>
        <Box sx={{ maxWidth: '504px', width: '100%', mt: [5, 0] }}>
          {showFilters && (
            <Field
              multiselect={false}
              title="Challenge on behalf of"
              field="projects"
              type="filters"
              setValue={async value => {
                await setValue('categories', value)
                // setDisabled(value)
              }}
              items={items}
            />
          )}
          <Field
            title={title}
            value={value}
            type={fieldType}
            charsCount={charsCount}
            placeholder={placeholder}
            setValue={async value => {
              setValue(value)
            }}
          />
          <Button
            variant={'secondary'}
            onClick={e => {
              // TODO: loading state
              handleClick(e)
            }}
            text={text}
            icon={icon}
            sx={{ margin: ['auto', 'auto', 0] }}
            disabled={value.length === 0}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

TabView.propTypes = {
  projects: PropTypes.array,
  fieldType: PropTypes.string,
  description: PropTypes.string,
  charsCount: PropTypes.number,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  heading: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.string,
  handleClick: PropTypes.func,
  showFilters: PropTypes.bool,
}

export default TabView
