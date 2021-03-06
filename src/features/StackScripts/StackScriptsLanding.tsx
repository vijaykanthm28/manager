import { compose } from 'ramda';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AddNewLink from 'src/components/AddNewLink';
import CircleProgress from 'src/components/CircleProgress';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import setDocs, { SetDocsProps } from 'src/components/DocsSidebar/setDocs';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import Grid from 'src/components/Grid';
import Notice from 'src/components/Notice';
import withImagesContainer from 'src/containers/withImages.container';
import { StackScripts } from 'src/documentation';
import StackScriptPanel from './StackScriptPanel';

type ClassNames = 'root' | 'title';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  title: {
    marginBottom: theme.spacing.unit * 2
  }
});

type CombinedProps = SetDocsProps &
  WithImagesProps &
  WithStyles<ClassNames> &
  RouteComponentProps<{}>;

export class StackScriptsLanding extends React.Component<CombinedProps, {}> {
  static docs = [StackScripts];

  goToCreateStackScript = () => {
    const { history } = this.props;
    history.push('/stackscripts/create');
  };

  render() {
    const { classes, history, imagesData, imagesLoading } = this.props;

    return (
      <React.Fragment>
        <DocumentTitleSegment segment="StackScripts" />
        {!!history.location.state &&
          !!history.location.state.successMessage && (
            <Notice success text={history.location.state.successMessage} />
          )}
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography
              role="header"
              variant="h1"
              className={classes.title}
              data-qa-title
            >
              StackScripts
            </Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="flex-end">
              <Grid item className="pt0">
                <AddNewLink
                  onClick={this.goToCreateStackScript}
                  label="Create New StackScript"
                  data-qa-create-new-stackscript
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          {imagesLoading ? (
            <CircleProgress />
          ) : (
            <StackScriptPanel publicImages={imagesData} noHeader={true} />
          )}
        </Grid>
      </React.Fragment>
    );
  }
}

const styled = withStyles(styles);

interface WithImagesProps {
  imagesData: Linode.Image[];
  imagesLoading: boolean;
  imagesError?: Linode.ApiFieldError[];
}

export default compose(
  withImagesContainer((ownProps, imagesData, imagesLoading, imagesError) => ({
    ...ownProps,
    imagesData: imagesData.filter(i => i.is_public === true),
    imagesLoading,
    imagesError
  })),

  styled,
  withRouter,
  setDocs(StackScriptsLanding.docs)
)(StackScriptsLanding);
