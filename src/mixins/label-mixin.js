import d3 from "d3"

const NON_INDEX = -1

export default function labelMixin (chart) {
  const events = ["xLabel", "yLabel"]
  const _listeners = d3.dispatch.apply(d3, events)
  const _on = chart.on.bind(chart)
  let _measureLabelsOn = false

  chart.measureLabelsOn = function (val) {
    if (!arguments.length) {
      return _measureLabelsOn
    }
    _measureLabelsOn = val
    return chart
  }


  chart.on = function (event, listener) {
    const baseEvent = event.includes(".") ? event.slice(0, event.indexOf(".")) : event
    if (events.indexOf(baseEvent) === NON_INDEX) {
      _on(event, listener)
    } else {
      _listeners.on(event, listener)
    }
    return chart
  }

  chart._invokeLabelYListener = function (val) {
    _listeners.yLabel(chart, val)
  }

  chart._invokeLabelXListener = function (val) {
    _listeners.xLabel(chart, val)
  }

  function setLabel (type, val) {
    const value = val ? val : chart[`${type}AxisLabel`]()

    chart[`${type}AxisLabel`](value)
    if (chart._isRangeChart) {
      chart.focusChart()[`_invokeLabel${type.toUpperCase()}Listener`](value)
      if (type === "x") {
        chart.redrawAsync()
      }
      return
    }
    chart[`_invokeLabel${type.toUpperCase()}Listener`](val)
  }

  chart.prepareLabelEdit = function (type = "y") {
    if (
      (chart.rangeChartEnabled() && type === "x") || (chart._isRangeChart && type === "y")
    ) {
      return
    }
    const yOffset = chart.rangeChartEnabled() && chart._rangeChartCreated ? chart.rangeChart().height() - chart.rangeChart().margins().bottom + chart.margins().bottom : chart.margins().bottom

    const iconPosition = {
      left: type === "y" ? "" : `${chart.effectiveWidth() / 2 + chart.margins().left}px`,
      top: type === "y" ? `${(chart.effectiveHeight() + yOffset) / 2 + chart.margins().top}px` : ""
    }

    chart
      .root()
      .selectAll(`.axis-label-edit.type-${type}`)
      .remove()

    chart
      .root()
      .selectAll(".y-axis-label, .x-axis-label")
      .style("display", "none")

    const editorWrapper = chart
      .root()
      .append("div")
      .attr("class", `axis-label-edit type-${type}`)
      .style("top", iconPosition.top)
      .style("left", iconPosition.left)

    editorWrapper
      .append("span")
      .text(chart[`${type}AxisLabel`]())

    editorWrapper
      .append("input")
      .attr("value", chart[`${type}AxisLabel`]())
      .on("focus", function () {
        this.select()
      })
      .on("keyup", function () {
        d3.select(this.parentNode).select("span").text(this.value)
      })
      .on("change", function () {
        setLabel(type, this.value)
      })
      .on("blur", function () {
        setLabel(type, this.value)
      })
  }

  return chart
}
