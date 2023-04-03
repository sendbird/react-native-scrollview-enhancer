package com.scrollviewenhancer

import android.content.Context
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.view.ReactViewGroup

class ScrollViewEnhancerView(context: Context): ReactViewGroup(context) {
  private var mMaintainVisibleContentPositionHelper: MVCPHelper? = null
  private var mConfig: MVCPHelper.Config? = null
  private var mScrollView: ReactScrollView? = null

  private fun getScrollView(): ReactScrollView? {
    if(mScrollView != null) return mScrollView

    this.childCount.let {
      for (i in 0 until it) {
        val view = this.getChildAt(i)
        if (view is ReactScrollView) {
          mScrollView = view
          return mScrollView
        }
      }
      return null
    }
  }

  private fun initHelper() {
    if (mConfig != null && mMaintainVisibleContentPositionHelper == null) {
      getScrollView()?.let {
        mMaintainVisibleContentPositionHelper = MaintainVisibleScrollPositionHelper(it, false)
        mMaintainVisibleContentPositionHelper?.start()
      }
    } else if (mConfig == null && mMaintainVisibleContentPositionHelper != null) {
      mMaintainVisibleContentPositionHelper?.stop()
      mMaintainVisibleContentPositionHelper = null
    }

    if (mMaintainVisibleContentPositionHelper != null) {
      mMaintainVisibleContentPositionHelper?.setConfig(mConfig)
    }
  }

  fun setMaintainVisibleContentPosition(config: MVCPHelper.Config?) {
    mConfig = config
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    initHelper()
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    mMaintainVisibleContentPositionHelper?.stop()
    mMaintainVisibleContentPositionHelper = null
    mScrollView = null
    mConfig = null
  }
}
