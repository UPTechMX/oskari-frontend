import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'oskari-ui';

const MandatoryContext = React.createContext();

const StyledBorder = styled('div')`
border-right: 1px dotted orange;
border-bottom: 1px dotted orange;
padding-right: 5px;
padding-bottom: 5px;
margin-bottom: 5px;
`;

/** *
 * import { Mandatory, MandatoryIcon } from './Mandatory';
 *
 * const SomeComponent = () => (
 *  <div>... some complex structure with <MandatoryIcon /> inside</div>
 * );
 *
 * Show field as mandatory (placement is determined inside SomeComponent):
 *     <Mandatory><SomeComponent /></Mandatory>
 *
 * Don't show field as mandatory:
 *     <SomeComponent />
 * );
 */
export const Mandatory = ({ children }) => {
    return <StyledBorder>
        <MandatoryContext.Provider value={true}>{children}</MandatoryContext.Provider>
    </StyledBorder>;
};

Mandatory.propTypes = {
    children: PropTypes.any
};

// TODO: isValid should probably be a prop in Mandatory instead
export const MandatoryIcon = ({ isValid = false }) => (
    <MandatoryContext.Consumer>
        {
            isMandatory => {
                if (!isMandatory) {
                    // Not wrapped in MandatoryContext -> Don't return any UI element
                    return null;
                }
                // This was wrapped in mandatory -> Show users it's required
                // red by default and when isValid=false
                // green when isValid=true
                return <Icon type="star" theme="twoTone" twoToneColor={isValid ? '#52c41a' : '#da5151'} />;
            }
        }
    </MandatoryContext.Consumer>
);

MandatoryIcon.propTypes = {
    isValid: PropTypes.bool
};
