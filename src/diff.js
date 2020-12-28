
const PATCH = {
  INSTER: 'inster',
  REMOVE: 'remove',
  PROPS: 'props',
  REPLACE: 'replace',
  VTEXT: "vtext",
}

function diff(oldNode, newNode) {
  const patches = [];
  walk(oldNode, newNode, patches, 0);
  return patches;
}

/**
 * 
 * VDOM 节点的对比§
上面代码只是对 VDOM 进行了简单的深度优先遍历，在遍历中，还需要对每个 VDOM 进行一些对比，具体分为以下几种情况：

旧节点不存在，插入新节点；新节点不存在，删除旧节点
新旧节点如果都是 VNode，且新旧节点 tag 相同
对比新旧节点的属性
对比新旧节点的子节点差异，通过 key 值进行重排序，key 值相同节点继续向下遍历
新旧节点如果都是 VText，判断两者文本是否发生变化
其他情况直接用新节点替代旧节点
 * @param {*} oldNode 
 * @param {*} newNode 
 * @param {*} patches 
 * @param {*} index 
 */

function walk(oldNode, newNode, patches, index) {
  if (newNode === oldNode) { return }

  let patch = patches[index];
  if (!oldNode) {
    // 旧节点不存在，直接插入
    patch = appendPatch(patch, {
      type: PATCH.INSERT,
      vNode: newNode,
    })
  } else if (!newNode) {
    // 新节点不存在，删除旧节点
    patch = appendPatch(patch, {
      type: PATCH.REMOVE,
      vNode: null,
    })
  } else if (isVNode(newNode)) {
    if (isVNode(oldNode)) {
      // 相同类型节点的 diff
      if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
        // 新老节点属性的对比
        const propsPatch = diffProps(newNode.props, oldNode.props)
        if (propsPatch && propsPatch.length > 0) {
          patch = appendPatch(patch, {
            type: PATCH.PROPS,
            patches: propsPatch,
          })
        }
        // 新老节点子节点的对比
        patch = diffChildren(oldNode, newNode, patches, patch, index)
      }
    } else {
      // 新节点替换旧节点
      patch = appendPatch(patch, {
        type: PATCH.REPLACE,
        vNode: newNode,
      })
    }
  } else if (isVText(newNode)) {
    if (!isVText(oldNode)) {
      // 将旧节点替换成文本节点
      patch = appendPatch(patch, {
        type: PATCH.VTEXT,
        vNode: newNode
      })
    } else if (newNode.text !== oldNode.text) {
      // 替换文本
      patch = appendPatch(patch, {
        type: PATCH.VTEXT,
        vNode: newNode
      })
    }
  }

  if (patch) {
    // 将补丁放入对应位置
    patches[index] = patch;
  }
}

// 一个节点可能有多个 patch
// 多个patch时，使用数组进行存储
function appendPatch(patch, apply) {
  if (patch) {
    if (isArray(patch)) {
      patch.push(apply)
    } else {
      patch = [patch, apply]
    }
    return patch;
  } else {
    return apply;
  }
}

/** 属性对比 */
function diffProps(newProps, oldProps) {
  const patches = []
  const props = Object.assign({}, newProps, oldProps)

  Object.keys(props).forEach(key => {
    const newVal = newProps[key]
    const oldVal = oldProps[key]
    if (!newVal) {
      patches.push({
        type: PATCH.REMOVE_PROP,
        key,
        value: oldVal,
      })
    }

    if (oldVal === undefined || newVal !== oldVal) {
      patches.push({
        type: PATCH.SET_PROP,
        key,
        value: newVal,
      })
    }
  })

  return patches
}