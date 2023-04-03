package com.scrollviewenhancer

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

class ScrollViewEnhancerViewManager : ViewGroupManager<ScrollViewEnhancerView>() {
  override fun getName() = "ScrollViewEnhancerView"

  override fun createViewInstance(ctx: ThemedReactContext) = ScrollViewEnhancerView(ctx)


  @ReactProp(name = "maintainVisibleContentPosition")
  fun setMaintainVisibleContentPosition(view: ScrollViewEnhancerView, value: ReadableMap?) {
    if (value != null) {
      view.setMaintainVisibleContentPosition(MVCPHelper.Config.fromReadableMap(value))
    } else {
      view.setMaintainVisibleContentPosition(null)
    }
  }
}
