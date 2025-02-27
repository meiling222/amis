import React from 'react';
import cx from 'classnames';
import TreeSelector from '../../components/Tree';
import {
  FormOptionsControl,
  OptionsControl,
  OptionsControlProps
} from './Options';
import {Spinner} from '../../components';
import {SchemaApi} from '../../Schema';
import {autobind, createObject} from '../../utils/helper';
import {Action} from '../../types';

/**
 * Tree 下拉选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/tree
 */
export interface TreeControlSchema extends FormOptionsControl {
  type: 'input-tree';

  /**
   * 是否隐藏顶级
   */
  hideRoot?: boolean;

  /**
   * 顶级选项的名称
   */
  rootLabel?: string;

  /**
   * 顶级选项的值
   */
  rootValue?: any;

  /**
   * 显示图标
   */
  showIcon?: boolean;

  /**
   * 父子之间是否完全独立。
   */
  cascade?: boolean;

  /**
   * 选父级的时候是否把子节点的值也包含在内。
   */
  withChildren?: boolean;

  /**
   * 选父级的时候，是否只把子节点的值包含在内
   */
  onlyChildren?: boolean;

  /**
   * 顶级节点是否可以创建子节点
   */
  rootCreatable?: boolean;

  /**
   * 是否开启节点路径模式
   */
  enableNodePath?: boolean;

  /**
   * 开启节点路径模式后，节点路径的分隔符
   */
  pathSeparator?: string;

  /**
   * 是否显示展开线
   */
  showOutline?: boolean;

  deferApi?: SchemaApi;
}

export interface TreeProps
  extends OptionsControlProps,
    Omit<
      TreeControlSchema,
      | 'type'
      | 'options'
      | 'className'
      | 'inputClassName'
      | 'descriptionClassName'
    > {
  enableNodePath?: boolean;
  pathSeparator?: string;
}

export default class TreeControl extends React.Component<TreeProps> {
  static defaultProps: Partial<TreeProps> = {
    placeholder: 'loading',
    multiple: false,
    rootLabel: '顶级',
    rootValue: '',
    showIcon: true,
    enableNodePath: false,
    pathSeparator: '/'
  };
  treeRef: any;

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  doAction(action: Action, data: any, throwErrors: boolean) {
    const {resetValue, onChange, options} = this.props;
    if (action.actionType && ['clear', 'reset'].includes(action.actionType)) {
      onChange && onChange(resetValue ?? '');
    }
    if (action.actionType === 'expand') {
      this.treeRef.syncUnFolded(this.props, action.openLevel);
    }
    if (action.actionType === 'collapse') {
      this.treeRef.syncUnFolded(this.props, 0);
    }
  }

  @autobind
  async handleChange(value: any) {
    const {onChange, dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange && onChange(value);
  }

  @autobind
  domRef(ref: any) {
    this.treeRef = ref;
  }

  render() {
    const {
      className,
      treeContainerClassName,
      classPrefix: ns,
      value,
      enableNodePath,
      pathSeparator = '/',
      disabled,
      joinValues,
      extractValue,
      delimiter,
      placeholder,
      options,
      multiple,
      valueField,
      initiallyOpen,
      unfoldedLevel,
      withChildren,
      onlyChildren,
      loading,
      hideRoot,
      rootLabel,
      cascade,
      rootValue,
      showIcon,
      showRadio,
      showOutline,
      onAdd,
      creatable,
      createTip,
      addControls,
      onEdit,
      editable,
      editTip,
      editControls,
      removable,
      removeTip,
      onDelete,
      rootCreatable,
      rootCreateTip,
      labelField,
      iconField,
      nodePath,
      deferLoad,
      expandTreeOptions,
      translate: __
    } = this.props;

    return (
      <div
        className={cx(`${ns}TreeControl`, className, treeContainerClassName)}
      >
        <Spinner size="sm" key="info" show={loading} />
        {loading ? null : (
          <TreeSelector
            classPrefix={ns}
            onRef={this.domRef}
            labelField={labelField}
            valueField={valueField}
            iconField={iconField}
            disabled={disabled}
            onChange={this.handleChange}
            joinValues={joinValues}
            extractValue={extractValue}
            delimiter={delimiter}
            placeholder={__(placeholder)}
            options={options}
            multiple={multiple}
            initiallyOpen={initiallyOpen}
            unfoldedLevel={unfoldedLevel}
            withChildren={withChildren}
            onlyChildren={onlyChildren}
            hideRoot={hideRoot}
            rootLabel={__(rootLabel)}
            rootValue={rootValue}
            showIcon={showIcon}
            showRadio={showRadio}
            showOutline={showOutline}
            cascade={cascade}
            foldedField="collapsed"
            value={value || ''}
            nodePath={nodePath}
            enableNodePath={enableNodePath}
            pathSeparator={pathSeparator}
            selfDisabledAffectChildren={false}
            onAdd={onAdd}
            creatable={creatable}
            createTip={createTip}
            rootCreatable={rootCreatable}
            rootCreateTip={rootCreateTip}
            onEdit={onEdit}
            editable={editable}
            editTip={editTip}
            removable={removable}
            removeTip={removeTip}
            onDelete={onDelete}
            bultinCUD={!addControls && !editControls}
            onDeferLoad={deferLoad}
            onExpandTree={expandTreeOptions}
          />
        )}
      </div>
    );
  }
}

@OptionsControl({
  type: 'input-tree'
})
export class TreeControlRenderer extends TreeControl {}
