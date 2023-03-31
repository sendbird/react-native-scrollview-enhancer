package com.scrollviewenhancer

//import com.facebook.react.uimanager.SimpleViewGroupManager
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

class ScrollViewEnhancerViewManager : ViewGroupManager<EnhancerFragment>() {
  override fun getName() = "ScrollViewEnhancerView"

  override fun createViewInstance(ctx: ThemedReactContext) = EnhancerFragment(ctx)


  @ReactProp(name = "maintainVisibleContentPosition")
  fun setMaintainVisibleContentPosition(view: EnhancerFragment, value: ReadableMap?) {
    if (value != null) {
      view.setMaintainVisibleContentPosition(
        MaintainVisibleScrollPositionHelper.Config.fromReadableMap(value)
      )
    } else {
      view.setMaintainVisibleContentPosition(null)
    }
  }
}
