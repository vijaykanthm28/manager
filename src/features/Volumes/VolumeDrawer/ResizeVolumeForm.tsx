import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { compose } from 'recompose';
import withVolumesRequests, {
  VolumesRequests
} from 'src/containers/volumesRequests.container';
import { resetEventsPolling } from 'src/events';
import { ResizeVolumeSchema } from 'src/services/volumes/volumes.schema';
import NoticePanel from './NoticePanel';
import PricePanel from './PricePanel';
import SizeField from './SizeField';
import { handleFieldErrors, handleGeneralErrors } from './utils';
import VolumesActionsPanel from './VolumesActionsPanel';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface Props {
  onClose: () => void;
  volumeSize: number;
  volumeId: number;
  volumeLabel: string;
  onSuccess: (volumeLabel: string, message?: string) => void;
}

type CombinedProps = Props & VolumesRequests & WithStyles<ClassNames>;

const ResizeVolumeForm: React.StatelessComponent<CombinedProps> = props => {
  const {
    volumeId,
    volumeSize,
    onClose,
    volumeLabel,
    onSuccess,
    resizeVolume
  } = props;
  const initialValues = { size: volumeSize };
  const validationSchema = ResizeVolumeSchema(volumeSize);

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={(
        values,
        { resetForm, setSubmitting, setStatus, setErrors }
      ) => {
        setSubmitting(true);

        resizeVolume({ volumeId, size: Number(values.size) })
          .then(response => {
            resetForm(initialValues);
            setSubmitting(false);
            resetEventsPolling();
            onSuccess(volumeLabel, `Volume scheduled to be resized.`);
          })
          .catch(errorResponse => {
            const defaultMessage = `Unable to resize this volume at this time. Please try again later.`;
            const mapErrorToStatus = (generalError: string) =>
              setStatus({ generalError });

            setSubmitting(false);
            handleFieldErrors(setErrors, errorResponse);
            handleGeneralErrors(
              mapErrorToStatus,
              errorResponse,
              defaultMessage
            );
          });
      }}
      initialValues={initialValues}
      render={formikProps => {
        const {
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          resetForm,
          status,
          values
        } = formikProps;

        return (
          <Form>
            {status && (
              <NoticePanel
                success={status.success}
                error={status.generalError}
              />
            )}

            <SizeField
              error={errors.size}
              name="size"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.size}
              resize={volumeSize}
            />

            <PricePanel value={values.size} currentSize={volumeSize} />

            <VolumesActionsPanel
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => {
                resetForm();
                onClose();
              }}
            />
          </Form>
        );
      }}
    />
  );
};

const styled = withStyles(styles);

const enhanced = compose<CombinedProps, Props>(
  styled,
  withVolumesRequests
);

export default enhanced(ResizeVolumeForm);
