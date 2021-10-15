import React from 'react';
import { useLocation } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { css } from '@emotion/css';
import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Icon, IconName, useTheme2 } from '@grafana/ui';
import config from '../../config';
import { isLinkActive, isSearchActive } from './utils';
import NavBarItem from './NavBarItem';

const TopSection = () => {
  const newNavigationEnabled = config.featureToggles.newNavigation;
  const location = useLocation();
  const theme = useTheme2();
  const styles = getStyles(theme, newNavigationEnabled);
  const navTree: NavModelItem[] = cloneDeep(config.bootData.navTree);
  const mainLinks = navTree.filter((item) => {
    if (newNavigationEnabled) {
      return !item.hideFromMenu && !item.id?.startsWith('plugin-page-');
    }
    return !item.hideFromMenu;
  });
  const activeItemId = mainLinks.find((item) => isLinkActive(location.pathname, item))?.id;

  const onOpenSearch = () => {
    locationService.partial({ search: 'open' });
  };

  return (
    <div data-testid="top-section-items" className={styles.container}>
      {!newNavigationEnabled && (
        <NavBarItem isActive={isSearchActive(location)} label="Search dashboards" onClick={onOpenSearch}>
          <Icon name="search" size="xl" />
        </NavBarItem>
      )}
      {mainLinks.map((link, index) => {
        return (
          <NavBarItem
            key={`${link.id}-${index}`}
            isActive={!isSearchActive(location) && activeItemId === link.id}
            label={link.text}
            menuItems={link.children}
            target={link.target}
            url={link.url}
          >
            {link.icon && <Icon name={link.icon as IconName} size="xl" />}
            {link.img && <img src={link.img} alt={`${link.text} logo`} />}
          </NavBarItem>
        );
      })}
    </div>
  );
};

export default TopSection;

const getStyles = (theme: GrafanaTheme2, newNavigationEnabled: boolean) => ({
  container: css`
    display: none;

    ${theme.breakpoints.up('md')} {
      background-color: ${newNavigationEnabled ? theme.colors.background.primary : 'inherit'};
      border: ${newNavigationEnabled ? `1px solid ${theme.components.panel.borderColor}` : 'none'};
      border-radius: 2px;
      display: flex;
      flex-direction: inherit;
      margin-top: ${newNavigationEnabled ? 'none' : theme.spacing(5)};
    }

    .sidemenu-open--xs & {
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing(1)};
    }
  `,
});
