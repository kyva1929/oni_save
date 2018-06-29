import * as React from "react";
import { connect } from "react-redux";

import Modal from "react-modal";

import Flex from "@/components/Flex";

import { getSaveItemEditor } from "@/services/save-structure";

import mapStateToProps, { StateProps } from "./derived-state";
import mapDispatchToProps, { DispatchProps } from "./events";

import { getEditor } from "./editors";

import SaveEditorContainer from "./components/SaveEditorContainer";
import SidebarContainer from "./components/SidebarContainer";
import ContentContainer from "./components/ContentContainer";

import SaveStructureTree from "./components/SaveStructureTree";
import SelectPathBreadcrumb from "./components/SelectedPathBreadcrumb";

type Props = StateProps & DispatchProps;
class SaveEditor extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedPath: null
    };
  }

  render() {
    const {
      error,
      oniSave,
      loadingState,
      selectedPath,
      onDismissError
    } = this.props;

    switch (loadingState) {
      case "loading":
        return (
          <Modal isOpen={true} contentLabel="Loading">
            <p>Loading File</p>
          </Modal>
        );
      case "saving":
        return (
          <Modal isOpen={true} contentLabel="Saving">
            <p>Saving File</p>
          </Modal>
        );
    }

    if (error) {
      return (
        <Modal isOpen={true} onRequestClose={onDismissError}>
          <Flex.Container direction="column" width="100%" height="100%">
            <Flex.Item grow>
              <h2>Error</h2>
              <code>{error.stack || error.message || String(error)}</code>
            </Flex.Item>
            <Flex.Item>
              <button onClick={onDismissError}>Close</button>
            </Flex.Item>
          </Flex.Container>
        </Modal>
      );
    }

    const editorType =
      (oniSave && getSaveItemEditor(selectedPath, oniSave)) || null;

    const ObjectEditor = getEditor(editorType);

    return (
      <SaveEditorContainer>
        {oniSave && (
          <Flex.Container direction="row" width="100%" height="100%">
            <Flex.Item>
              <SidebarContainer>
                <SaveStructureTree />
              </SidebarContainer>
            </Flex.Item>
            <Flex.Item grow shrink>
              <ContentContainer>
                <SelectPathBreadcrumb />
                <ObjectEditor />
              </ContentContainer>
            </Flex.Item>
          </Flex.Container>
        )}
      </SaveEditorContainer>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveEditor);
