/**
 * Original Code
 * @link https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/views/scroll/MaintainVisibleScrollPositionHelper.java
 */

/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @link
 */

package com.scrollviewenhancer

import android.graphics.Rect
import android.view.View
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.UIImplementation.LayoutUpdateListener
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.UIManagerModuleListener
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.view.ReactViewGroup
import java.lang.ref.WeakReference


abstract class MVCPHelper {
  class Config internal constructor(
    val minIndexForVisible: Int,
    val autoScrollToTopThreshold: Int?
  ) {
    companion object {
      fun fromReadableMap(value: ReadableMap): Config {
        val minIndexForVisible: Int = value.getInt("minIndexForVisible")
        val autoScrollToTopThreshold: Int? =
          if (value.hasKey("autoscrollToTopThreshold")) value.getInt("autoscrollToTopThreshold") else null
        return Config(minIndexForVisible, autoScrollToTopThreshold)
      }
    }
  }

  protected var mConfig: Config? = null
  fun setConfig(config: Config?) {
    mConfig = config
  }
  abstract fun start()
  abstract fun stop()
  abstract fun updateScrollPosition()
}


/**
 * Manage state for the maintainVisibleContentPosition prop.
 *
 * This uses UIManager to listen to updates and capture position of items before and after layout.
 */
class MaintainVisibleScrollPositionHelper(
  private val mScrollView: ReactScrollView,
  private val mHorizontal: Boolean = false
): MVCPHelper(), UIManagerModuleListener, LayoutUpdateListener {
  private var mFirstVisibleView: WeakReference<View>? = null
  private var mPrevFirstVisibleFrame: Rect? = null
  private var mListening: Boolean = false

  private val contentView: ReactViewGroup?
    get() = mScrollView.getChildAt(0) as? ReactViewGroup

  private val uiManager: UIManager
    get() = Assertions.assertNotNull(
      UIManagerHelper.getUIManagerForReactTag(mScrollView.context as ReactContext, mScrollView.id)
    )
  private val uiManagerModule: UIManagerModule?
    get() = uiManager as? UIManagerModule

  /**
   * Start listening to view hierarchy updates. Should be called when this is created.
   */
  override fun start() {
    if (mListening) return

    mListening = true
    uiManagerModule?.addUIManagerListener(this)
    uiManagerModule?.uiImplementation?.setLayoutUpdateListener(this)
  }

  /**
   * Stop listening to view hierarchy updates. Should be called before this is destroyed.
   */
  override fun stop() {
    if (!mListening) return

    mListening = false
    uiManagerModule?.removeUIManagerListener(this)
  }

  /**
   * Update the scroll position of the managed ScrollView. This should be called after layout
   * has been updated.
   */
  override fun updateScrollPosition() {
    if ((mConfig == null) || (mFirstVisibleView == null) || (mPrevFirstVisibleFrame == null)) {
      return
    }

    val firstVisibleView: View? = mFirstVisibleView!!.get()
    val newFrame = Rect()
    firstVisibleView!!.getHitRect(newFrame)
    if (mHorizontal) {
      val deltaX: Int = newFrame.left - mPrevFirstVisibleFrame!!.left
      if (deltaX != 0) {
        val scrollX: Int = mScrollView.scrollX
        mScrollView.scrollTo(scrollX + deltaX, mScrollView.scrollY)
        mPrevFirstVisibleFrame = newFrame
        if (mConfig!!.autoScrollToTopThreshold != null && scrollX <= mConfig!!.autoScrollToTopThreshold!!) {
          mScrollView.reactSmoothScrollTo(0, mScrollView.scrollY)
        }
      }
    } else {
      val deltaY: Int = newFrame.top - mPrevFirstVisibleFrame!!.top
      if (deltaY != 0) {
        val scrollY: Int = mScrollView.scrollY
        mScrollView.scrollTo(mScrollView.scrollX, scrollY + deltaY)
        mPrevFirstVisibleFrame = newFrame
        if (mConfig!!.autoScrollToTopThreshold != null && scrollY <= mConfig!!.autoScrollToTopThreshold!!) {
          mScrollView.reactSmoothScrollTo(mScrollView.scrollX, 0)
        }
      }
    }
  }

  private fun computeTargetView() {
    if (mConfig == null) return

    contentView?.let { contentView ->
      val currentScroll: Int = if (mHorizontal) mScrollView.scrollX else mScrollView.scrollY
      for (i in mConfig!!.minIndexForVisible until contentView.childCount) {
        val child: View = contentView.getChildAt(i)
        val position: Float = if (mHorizontal) child.x else child.y
        if (position > currentScroll || i == contentView.childCount - 1) {
          mFirstVisibleView = WeakReference(child)
          val frame = Rect()
          child.getHitRect(frame)
          mPrevFirstVisibleFrame = frame
          break
        }
      }
    }
  }

  // UIManagerModuleListener
  override fun willDispatchViewUpdates(p0: UIManagerModule?) {
    computeTargetView()
  }


  // LayoutUpdateListener
  override fun onLayoutUpdated(p0: ReactShadowNode<out ReactShadowNode<*>>?) {
    updateScrollPosition()
  }
}
