/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.scrollviewenhancer

import android.graphics.Rect
import android.view.View
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.ViewUtil
import com.facebook.react.views.scroll.ReactHorizontalScrollView
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.view.ReactViewGroup
import java.lang.ref.WeakReference


abstract class MaintainVisibleScrollPositionHelper {
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
  abstract fun start(): Unit
  abstract fun stop(): Unit
  abstract fun updateScrollPosition(): Unit
}


/**
 * Manage state for the maintainVisibleContentPosition prop.
 *
 * This uses UIManager to listen to updates and capture position of items before and after layout.
 */
class MaintainVisibleScrollPositionHelperV(
  private val mScrollView: ReactScrollView,
  private val mHorizontal: Boolean = false
): UIManagerListener, MaintainVisibleScrollPositionHelper() {
  private var mFirstVisibleView: WeakReference<View>? = null
  private var mPrevFirstVisibleFrame: Rect? = null
  private var mListening: Boolean = false

  /**
   * Start listening to view hierarchy updates. Should be called when this is created.
   */
  override fun start() {
    if (mListening) {
      return
    }
    mListening = true
    uIManagerModule.addUIManagerEventListener(this)
  }

  /**
   * Stop listening to view hierarchy updates. Should be called before this is destroyed.
   */
  override fun stop() {
    if (!mListening) {
      return
    }
    mListening = false
    uIManagerModule.removeUIManagerEventListener(this)
  }

  /**
   * Update the scroll position of the managed ScrollView. This should be called after layout
   * has been updated.
   */
  override fun updateScrollPosition() {
    if ((mConfig == null
        ) || (mFirstVisibleView == null
        ) || (mPrevFirstVisibleFrame == null)
    ) {
      return
    }
    val firstVisibleView: View? = mFirstVisibleView!!.get()
    val newFrame: Rect = Rect()
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

  private val contentView: ReactViewGroup
    get() = mScrollView.getChildAt(0) as ReactViewGroup

  private val uIManagerModule: UIManager
    get() = Assertions.assertNotNull(
      UIManagerHelper.getUIManager(
        mScrollView.context as ReactContext,
        ViewUtil.getUIManagerType(mScrollView.id)
      )
    )

  private fun computeTargetView() {
    if (mConfig == null) {
      return
    }
    val contentView: ReactViewGroup? = contentView
    if (contentView == null) {
      return
    }
    val currentScroll: Int = if (mHorizontal) mScrollView!!.scrollX else mScrollView!!.scrollY
    for (i in mConfig!!.minIndexForVisible until contentView.childCount) {
      val child: View = contentView.getChildAt(i)
      val position: Float = if (mHorizontal) child.x else child.y
      if (position > currentScroll || i == contentView.childCount - 1) {
        mFirstVisibleView = WeakReference(child)
        val frame: Rect = Rect()
        child.getHitRect(frame)
        mPrevFirstVisibleFrame = frame
        break
      }
    }
  }

  // UIManagerListener
  override fun willDispatchViewUpdates(uiManager: UIManager) {
    UiThreadUtil.runOnUiThread(
      object : Runnable {
        override fun run() {
          computeTargetView()
        }
      })
  }

  override fun didDispatchMountItems(uiManager: UIManager) {
    // noop
  }

  override fun didScheduleMountItems(uiManager: UIManager) {
    // noop
  }
}

/**
 * Manage state for the maintainVisibleContentPosition prop.
 *
 * This uses UIManager to listen to updates and capture position of items before and after layout.
 */
class MaintainVisibleScrollPositionHelperH(
  private val mScrollView: ReactHorizontalScrollView,
  private val mHorizontal: Boolean = false
): UIManagerListener, MaintainVisibleScrollPositionHelper() {
  private var mFirstVisibleView: WeakReference<View>? = null
  private var mPrevFirstVisibleFrame: Rect? = null
  private var mListening: Boolean = false

  /**
   * Start listening to view hierarchy updates. Should be called when this is created.
   */
  override fun start() {
    if (mListening) {
      return
    }
    mListening = true
    uIManagerModule.addUIManagerEventListener(this)
  }

  /**
   * Stop listening to view hierarchy updates. Should be called before this is destroyed.
   */
  override fun stop() {
    if (!mListening) {
      return
    }
    mListening = false
    uIManagerModule.removeUIManagerEventListener(this)
  }

  /**
   * Update the scroll position of the managed ScrollView. This should be called after layout
   * has been updated.
   */
  override fun updateScrollPosition() {
    if ((mConfig == null
        ) || (mFirstVisibleView == null
        ) || (mPrevFirstVisibleFrame == null)
    ) {
      return
    }
    val firstVisibleView: View? = mFirstVisibleView!!.get()
    val newFrame: Rect = Rect()
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

  private val contentView: ReactViewGroup
    get() = mScrollView.getChildAt(0) as ReactViewGroup

  private val uIManagerModule: UIManager
    get() = Assertions.assertNotNull(
      UIManagerHelper.getUIManager(
        mScrollView.context as ReactContext,
        ViewUtil.getUIManagerType(mScrollView.id)
      )
    )

  private fun computeTargetView() {
    if (mConfig == null) {
      return
    }
    val contentView: ReactViewGroup? = contentView
    if (contentView == null) {
      return
    }
    val currentScroll: Int = if (mHorizontal) mScrollView!!.scrollX else mScrollView!!.scrollY
    for (i in mConfig!!.minIndexForVisible until contentView.childCount) {
      val child: View = contentView.getChildAt(i)
      val position: Float = if (mHorizontal) child.x else child.y
      if (position > currentScroll || i == contentView.childCount - 1) {
        mFirstVisibleView = WeakReference(child)
        val frame: Rect = Rect()
        child.getHitRect(frame)
        mPrevFirstVisibleFrame = frame
        break
      }
    }
  }

  // UIManagerListener
  override fun willDispatchViewUpdates(uiManager: UIManager) {
    UiThreadUtil.runOnUiThread(
      object : Runnable {
        override fun run() {
          computeTargetView()
        }
      })
  }

  override fun didDispatchMountItems(uiManager: UIManager) {
    // noop
  }

  override fun didScheduleMountItems(uiManager: UIManager) {
    // noop
  }
}
