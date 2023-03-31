package com.scrollviewenhancer

import android.content.Context
import android.util.Log
import com.facebook.react.views.scroll.ReactHorizontalScrollView
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.view.ReactViewGroup


class EnhancerFragment(context: Context): ReactViewGroup(context) {
  var NAME = "SENDBIRD"
  private var mMaintainVisibleContentPositionHelper: MaintainVisibleScrollPositionHelper? = null

  private fun getChildHorizontalScrollView(): ReactHorizontalScrollView? {
    Log.d(NAME, "getChildHorizontalScrollView()")
    this.childCount.let {
      Log.d(NAME, "getChildHorizontalScrollView()/childCount$it")
      for (i in 0 until it) {
        val view = this.getChildAt(i)
        if (view is ReactHorizontalScrollView) {
          Log.d(NAME, "getChildHorizontalScrollView()/found ReactHorizontalScrollView $view")
          return view
        }
      }
      return null
    }
  }

  private fun getChildVerticalScrollView(): ReactScrollView? {
    Log.d(NAME, "getChildVerticalScrollView()")
    this.childCount.let {
      Log.d(NAME, "getChildVerticalScrollView()/childCount$it")
      for (i in 0 until it) {
        val view = this.getChildAt(i)
        if (view is ReactScrollView) {
          Log.d(NAME, "getChildVerticalScrollView()/found ReactScrollView $view")
          return view
        }
      }
      return null
    }
  }

  fun setMaintainVisibleContentPosition(config: MaintainVisibleScrollPositionHelper.Config?) {
    Log.d(NAME, "setMaintainVisibleContentPosition $config")

    if (config != null && mMaintainVisibleContentPositionHelper == null) {
      mMaintainVisibleContentPositionHelper = getChildHorizontalScrollView()?.let {
        MaintainVisibleScrollPositionHelperH(it, false)
      } ?: run {
        getChildVerticalScrollView()?.let {
          MaintainVisibleScrollPositionHelperV(it, false)
        }
      }
      mMaintainVisibleContentPositionHelper?.start()
    } else if (config == null && mMaintainVisibleContentPositionHelper != null) {
      mMaintainVisibleContentPositionHelper?.stop()
      mMaintainVisibleContentPositionHelper = null
    }

    if (mMaintainVisibleContentPositionHelper != null) {
      mMaintainVisibleContentPositionHelper?.setConfig(config)
    }
  }

  override fun onAttachedToWindow() {
    Log.d(NAME, "onAttachedToWindow")
    super.onAttachedToWindow()
    mMaintainVisibleContentPositionHelper?.start()
  }

  override fun onDetachedFromWindow() {
    Log.d(NAME, "onDetachedFromWindow")
    super.onDetachedFromWindow()
    mMaintainVisibleContentPositionHelper?.stop()
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    Log.d(NAME, "onLayout $changed")
    super.onLayout(changed, left, top, right, bottom)
    mMaintainVisibleContentPositionHelper?.updateScrollPosition()
  }
}
